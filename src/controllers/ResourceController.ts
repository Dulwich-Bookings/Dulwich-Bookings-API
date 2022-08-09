import {NextFunction, Request, Response} from 'express';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import {ResourceCreationAttributes} from '../models/Resource';
import TagMap, {TagMapCreationAttributes} from '../models/TagMap';
import ResourceMap, {
  ResourceMapCreationAttributes,
} from '../models/ResourceMap';
import ResourceService from '../services/ResourceService';
import TagMapService from '../services/TagMapService';
import ResourceMapService from '../services/ResourceMapService';
import sequelize from '../db';

export default class ResourceController {
  private resourceService: ResourceService;
  private tagMapService: TagMapService;
  private resourceMapService: ResourceMapService;

  constructor(
    resourceService: ResourceService,
    tagMapService: TagMapService,
    resourceMapService: ResourceMapService
  ) {
    this.resourceService = resourceService;
    this.tagMapService = tagMapService;
    this.resourceMapService = resourceMapService;
  }

  async createOneResource(req: Request, res: Response, next: NextFunction) {
    try {
      await sequelize.transaction(async t => {
        const toCreateResource: ResourceCreationAttributes = {
          ...req.body.resource,
          schoolId: req.user.schoolId,
        };
        const createdResource = await this.resourceService.createOneResource(
          toCreateResource,
          {transaction: t}
        );

        // [...new Set<number>(array)] ensures an unique array
        const tags: number[] = [...new Set<number>(req.body.tags)];
        const users: number[] = [...new Set<number>(req.body.users)];
        const tagMaps: TagMapCreationAttributes[] = tags.map(tagId => {
          return {
            tagId: tagId,
            resourceId: createdResource.id,
          };
        });
        const resourceMaps: ResourceMapCreationAttributes[] = users.map(
          user => {
            return {
              userId: user,
              resourceId: createdResource.id,
            };
          }
        );

        await this.resourceMapService.bulkCreateResourceMap(resourceMaps, {
          transaction: t,
        });
        await this.tagMapService.bulkCreateTagMap(tagMaps, {transaction: t});

        res.status(201);
        res.json({
          message: userFriendlyMessages.success.createResource,
          data: {resource: createdResource, tags: tags, users: users},
        });
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.createResource});
      next(e);
    }
  }

  async getAllResources(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user.schoolId;
      const resources =
        (await this.resourceService.getAllResources(schoolId)) || [];
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

  async getMyResources(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const resourceMaps =
        await this.resourceMapService.getResourceMapsByUserId(userId);
      const myResourceIds = resourceMaps
        .filter(resourceMap => resourceMap.resourceId)
        .map(subscriptionMap => subscriptionMap.resourceId!);

      const resources =
        (await this.resourceService.getResourceByIds(myResourceIds)) || [];

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

  async getOneResourceById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const resource = await this.resourceService.getOneResourceById(id);
      res.json({
        message: userFriendlyMessages.success.getOneResource,
        data: resource,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getOneResource});
      next(e);
    }
  }

  async updateOneResourceById(req: Request, res: Response, next: NextFunction) {
    try {
      await sequelize.transaction(async t => {
        const id = parseInt(req.params.id);
        const oldResource = await this.resourceService.getOneResourceById(id);
        const updatedAttributes = {
          ...oldResource,
          ...req.body.resource,
          schoolId: req.user.schoolId,
        };
        const updatedResource =
          await this.resourceService.updateOneResourceById(
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

        // All tagIds and userIds that belong to this particular resource
        const currentResourceTagIds: number[] = allTagMaps
          .filter(tagMap => tagMap.resourceId === id)
          .map(tagMap => tagMap.tagId);
        const currentResourceUserIds: number[] = allResourceMaps
          .filter(resourceMap => resourceMap.resourceId === id)
          .map(resourceMap => resourceMap.userId);

        // All tagMaps and ResourceMaps that belong to this particular resource
        const currentResourceMaps: ResourceMap[] = allResourceMaps.filter(
          resourceMap => resourceMap.resourceId === id
        );
        const currentTagMaps: TagMap[] = allTagMaps.filter(
          tagMap => tagMap.resourceId === id
        );

        // All Tag Maps and Resource Maps given by the user
        // [...new Set<number>(array)] ensures an unique array
        const inputTagIds: number[] = [...new Set<number>(req.body.tags)];
        const inputUserIds: number[] = [...new Set<number>(req.body.users)];
        const inputTagMaps: TagMapCreationAttributes[] = inputTagIds.map(
          (tagId: number) => {
            return {tagId: tagId, resourceId: id};
          }
        );
        const inputResourceMaps: ResourceMapCreationAttributes[] =
          inputUserIds.map((userId: number) => {
            return {userId: userId, resourceId: id};
          });

        // The TagMaps to create and delete
        const tagMapToCreate: TagMapCreationAttributes[] = inputTagMaps.filter(
          tagMap => !currentResourceTagIds.includes(tagMap.tagId)
        );
        const tagToDelete: number[] = currentResourceTagIds.filter(
          tagId => !inputTagIds.includes(tagId)
        );
        const tagMapToDelete: number[] = currentTagMaps
          .filter(tagMap => tagToDelete.includes(tagMap.tagId))
          .map(tagMap => tagMap.id);

        // The ResourceMaps to create and delete
        const resourceMapToCreate: ResourceMapCreationAttributes[] =
          inputResourceMaps.filter(
            resourceMap => !currentResourceUserIds.includes(resourceMap.userId)
          );
        const userToDelete: number[] = currentResourceUserIds.filter(
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
          message: userFriendlyMessages.success.updateResource,
          data: {
            resource: updatedResource,
            tags: inputTagIds,
            users: inputUserIds,
          },
        });
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.updateResource});
      next(e);
    }
  }

  async deleteOneResourceById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await this.resourceService.deleteOneResourceById(id);
      res.json({message: userFriendlyMessages.success.deleteResource});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.deleteResource});
      next(e);
    }
  }
}
