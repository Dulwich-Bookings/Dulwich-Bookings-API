import {NextFunction, Request, Response} from 'express';
import ResourceMapService from '../services/ResourceMapService';

export default class ResourceMapOwnerMiddleware {
  private resourceMapService: ResourceMapService;

  constructor(resourceMapService: ResourceMapService) {
    this.resourceMapService = resourceMapService;
  }

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
        return next();
      } else {
        return next();
      }
    } catch (e: unknown) {
      const {message} = e as Error;
      return res.status(400).json({message: message});
    }
  }

  async resourceMapOwner(req: Request, res: Response, next: NextFunction) {
    try {
      const {user} = req;
      const resourceMapId = parseInt(req.params.id);

      const resourceMapToCheck =
        await this.resourceMapService.getOneResourceMapById(resourceMapId);
      const isResourceMapOwnedByUser = resourceMapToCheck.userId === user.id;

      if (isResourceMapOwnedByUser) {
        req.isSkipRoleValidator = true;
        return next();
      } else {
        return next();
      }
    } catch (e: unknown) {
      const {message} = e as Error;
      return res.status(400).json({message: message});
    }
  }
}
