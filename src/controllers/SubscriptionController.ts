import {NextFunction, Request, Response} from 'express';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import {
  SubscriptionCreationAttributes,
  InvalidLinkError,
} from '../models/Subscription';
import SubscriptionService from '../services/SubscriptionService';
import TagMapService from '../services/TagMapService';
import ResourceMapService from '../services/ResourceMapService';
import sequelize from '../db';
import TagMap, {TagMapCreationAttributes} from '../models/TagMap';
import ResourceMap, {
  ResourceMapCreationAttributes,
} from '../models/ResourceMap';
import {InvalidUTCStringError} from '../utils/datetimeUtils';

export default class SubscriptionController {
  private subscriptionService: SubscriptionService;
  private tagMapService: TagMapService;
  private resourceMapService: ResourceMapService;

  constructor(
    subscriptionService: SubscriptionService,
    tagMapService: TagMapService,
    resourceMapService: ResourceMapService
  ) {
    this.subscriptionService = subscriptionService;
    this.tagMapService = tagMapService;
    this.resourceMapService = resourceMapService;
  }

  async createOneSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      await sequelize.transaction(async t => {
        const toCreate: SubscriptionCreationAttributes = {
          ...req.body.subscription,
          schoolId: req.user.schoolId,
        };
        const createdSubscription =
          await this.subscriptionService.createOneSubscription(toCreate, {
            transaction: t,
          });

        // [...new Set<number>(array)] ensures an unique array
        const tags: number[] = [...new Set<number>(req.body.tags)];
        const users: number[] = [...new Set<number>(req.body.users)];
        const tagMaps: TagMapCreationAttributes[] = tags.map(tagId => {
          return {
            tagId: tagId,
            subscriptionId: createdSubscription.id,
          };
        });
        const resourceMaps: ResourceMapCreationAttributes[] = users.map(
          user => {
            return {
              userId: user,
              subscriptionId: createdSubscription.id,
            };
          }
        );

        await this.resourceMapService.bulkCreateResourceMap(resourceMaps, {
          transaction: t,
        });
        await this.tagMapService.bulkCreateTagMap(tagMaps, {transaction: t});

        res.status(201);
        res.json({
          message: userFriendlyMessages.success.createSubscription,
          data: {subscription: createdSubscription, tags: tags, users: users},
        });
      });
    } catch (e) {
      res.status(400);
      if (e instanceof InvalidLinkError || InvalidUTCStringError) {
        res.json({message: (e as Error).message});
      } else {
        res.json({message: userFriendlyMessages.failure.createSubscription});
      }
      next(e);
    }
  }

  async getAllSubscriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user.schoolId;
      const subscriptions =
        (await this.subscriptionService.getAllSubscriptions(schoolId)) || [];
      res.json({
        message: userFriendlyMessages.success.getAllSubscriptions,
        data: subscriptions,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getAllSubscriptions});
      next(e);
    }
  }

  async getMySubscriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const resourceMaps =
        await this.resourceMapService.getResourceMapsByUserId(userId);
      const mySubscriptionIds = resourceMaps
        .filter(resourceMap => resourceMap.subscriptionId)
        .map(subscriptionMap => subscriptionMap.subscriptionId!);

      const resources =
        (await this.subscriptionService.getSubscriptionByIds(
          mySubscriptionIds
        )) || [];

      res.json({
        message: userFriendlyMessages.success.getAllResources,
        data: resources,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getAllResources});
      next(e);
    }
  }

  async getOneSubscriptionById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);
      const subscription =
        await this.subscriptionService.getOneSubscriptionById(id);
      res.json({
        message: userFriendlyMessages.success.getOneSubscription,
        data: subscription,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getOneSubscription});
      next(e);
    }
  }

  async updateOneSubscriptionById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await sequelize.transaction(async t => {
        const id = parseInt(req.params.id);
        const oldSubscription =
          await this.subscriptionService.getOneSubscriptionById(id);
        const updatedAttributes = {
          ...oldSubscription,
          ...req.body.subscription,
          schoolId: req.user.schoolId,
        };
        const updatedSubscription =
          await this.subscriptionService.updateOneSubscriptionById(
            id,
            updatedAttributes,
            {transaction: t}
          );

        // All Tag Maps and Resource Maps from the current Table
        const allTagMaps: TagMap[] = await this.tagMapService.getAllTagMaps({
          transaction: t,
        });
        const allResourceMaps: ResourceMap[] =
          await this.resourceMapService.getAllResourceMaps({transaction: t});

        // All tagIds and userIds that belong to this particular subscription
        const currentSubscriptionTagIds: number[] = allTagMaps
          .filter(tagMap => tagMap.subscriptionId === id)
          .map(tagMap => tagMap.tagId);
        const currentSubscriptionUserIds: number[] = allResourceMaps
          .filter(resourceMap => resourceMap.subscriptionId === id)
          .map(resourceMap => resourceMap.userId);

        // All tagMaps and ResourceMaps that belong to this particular subscription
        const currentResourceMaps: ResourceMap[] = allResourceMaps.filter(
          resourceMap => resourceMap.subscriptionId === id
        );
        const currentTagMaps: TagMap[] = allTagMaps.filter(
          tagMap => tagMap.subscriptionId === id
        );

        // All Tag Maps and Resource Maps given by the user
        // [...new Set<number>(array)] ensures an unique array
        const inputTagIds: number[] = [...new Set<number>(req.body.tags)];
        const inputUserIds: number[] = [...new Set<number>(req.body.users)];
        const inputTagMaps: TagMapCreationAttributes[] = inputTagIds.map(
          (tagId: number) => {
            return {tagId: tagId, subscriptionId: id};
          }
        );
        const inputResourceMaps: ResourceMapCreationAttributes[] =
          inputUserIds.map((userId: number) => {
            return {userId: userId, subscriptionId: id};
          });

        // The TagMaps to create and delete
        const tagMapToCreate: TagMapCreationAttributes[] = inputTagMaps.filter(
          tagMap => !currentSubscriptionTagIds.includes(tagMap.tagId)
        );
        const tagToDelete: number[] = currentSubscriptionTagIds.filter(
          tagId => !inputTagIds.includes(tagId)
        );
        const tagMapToDelete: number[] = currentTagMaps
          .filter(tagMap => tagToDelete.includes(tagMap.tagId))
          .map(tagMap => tagMap.id);

        // The ResourceMaps to create and delete
        const resourceMapToCreate: ResourceMapCreationAttributes[] =
          inputResourceMaps.filter(
            resourceMap =>
              !currentSubscriptionUserIds.includes(resourceMap.userId)
          );
        const userToDelete: number[] = currentSubscriptionUserIds.filter(
          userId => !inputUserIds.includes(userId)
        );
        const resourceMapToDelete: number[] = currentResourceMaps
          .filter(resourceMap => userToDelete.includes(resourceMap.userId))
          .map(resourceMap => resourceMap.id);

        // Creating and Deleting Tag Maps
        await this.tagMapService.bulkCreateTagMap(tagMapToCreate, {
          transaction: t,
        });
        await this.tagMapService.bulkDeleteTagMap(
          {id: tagMapToDelete},
          {
            transaction: t,
          }
        );

        // Creating and Deleting Resource Maps
        await this.resourceMapService.bulkCreateResourceMap(
          resourceMapToCreate,
          {transaction: t}
        );
        await this.resourceMapService.bulkDeleteResourceMap(
          {id: resourceMapToDelete},
          {transaction: t}
        );

        res.json({
          message: userFriendlyMessages.success.updateSubscription,
          data: {
            subscription: updatedSubscription,
            tags: inputTagIds,
            users: inputUserIds,
          },
        });
      });
    } catch (e) {
      res.status(400);
      if (e instanceof InvalidLinkError || InvalidUTCStringError) {
        res.json({message: (e as Error).message});
      } else {
        res.json({message: userFriendlyMessages.failure.updateSubscription});
      }
      next(e);
    }
  }

  async deleteOneSubscriptionById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);
      await this.subscriptionService.deleteOneSubscriptionById(id);
      res.json({message: userFriendlyMessages.success.deleteSubscription});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.deleteSubscription});
      next(e);
    }
  }
}
