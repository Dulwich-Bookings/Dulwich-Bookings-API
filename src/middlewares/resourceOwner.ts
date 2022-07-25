import {NextFunction, Request, Response} from 'express';
import ResourceMapService from '../services/ResourceMapService';

export default class ResourceOwnerMiddleware {
  private resourceMapService: ResourceMapService;

  constructor(resourceMapService: ResourceMapService) {
    this.resourceMapService = resourceMapService;
  }

  // middleware to check if user owns resource before updating/deleting resources and subscriptions
  resourceOwner(resourceType: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {user} = req;
        const resourceId = parseInt(req.params.id);

        const ownedResources =
          resourceType === 'Resource'
            ? await this.resourceMapService.getResourceMapsByUserIdAndResourceId(
                user.id,
                resourceId
              )
            : await this.resourceMapService.getResourceMapsByUserIdAndSubscriptionId(
                user.id,
                resourceId
              );

        const isResourceOwnedByUser = ownedResources.length !== 0;
        if (isResourceOwnedByUser) {
          req.isSkipRoleValidator = true;
        }
        return next();
      } catch (e: unknown) {
        const {message} = e as Error;
        return res.status(400).json({message: message});
      }
    };
  }

  // middleware to check if user owns resourceMap before bulk deleting resourceMaps
  async resourceMapsOwner(req: Request, res: Response, next: NextFunction) {
    try {
      const {user} = req;
      const resourceMapIds = req.body.id;

      const resourceMapsToCheck =
        await this.resourceMapService.getResourceMapsByIds(resourceMapIds);
      const resourceMapsNotOwned = resourceMapsToCheck.filter(
        resourceMap => resourceMap.userId !== user.id
      );
      const areAllResourceMapsOwnedByUser = resourceMapsNotOwned.length === 0;

      if (areAllResourceMapsOwnedByUser) {
        req.isSkipRoleValidator = true;
      }
      return next();
    } catch (e: unknown) {
      const {message} = e as Error;
      return res.status(400).json({message: message});
    }
  }

  // middleware to check if user owns resourceMap before deleting resourceMap
  async resourceMapOwner(req: Request, res: Response, next: NextFunction) {
    try {
      const {user} = req;
      const resourceMapId = parseInt(req.params.id);

      const resourceMapToCheck =
        await this.resourceMapService.getOneResourceMapById(resourceMapId);
      const isResourceMapOwnedByUser = resourceMapToCheck.userId === user.id;

      if (isResourceMapOwnedByUser) {
        req.isSkipRoleValidator = true;
      }
      return next();
    } catch (e: unknown) {
      const {message} = e as Error;
      return res.status(400).json({message: message});
    }
  }
}
