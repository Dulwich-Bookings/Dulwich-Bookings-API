import {NextFunction, Request, Response} from 'express';
import ResourceMapService from '../services/ResourceMapService';

export default class ResourceOwnerMiddleware {
  private resourceMapService: ResourceMapService;

  constructor(resourceMapService: ResourceMapService) {
    this.resourceMapService = resourceMapService;
  }

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
          return next();
        } else {
          return next();
        }
      } catch (e: unknown) {
        const {message} = e as Error;
        return res.status(400).json({message: message});
      }
    };
  }
}
