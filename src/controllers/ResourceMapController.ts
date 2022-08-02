import {NextFunction, Request, Response} from 'express';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import {ResourceMapCreationAttributes} from '../models/ResourceMap';
import ResourceMapService from '../services/ResourceMapService';
import {DeleteOptions} from '../services/UserService';

export default class ResourceMapController {
  private resourceMapService: ResourceMapService;
  constructor(resourceMapService: ResourceMapService) {
    this.resourceMapService = resourceMapService;
  }

  async getSelf(req: Request, res: Response, next: NextFunction) {
    try {
      const {user} = req;
      const userId = user.id;
      const selfResourceMaps =
        await this.resourceMapService.getResourceMapsByUserId(userId);
      res.json({
        message: userFriendlyMessages.success.getOneResourceMap,
        data: selfResourceMaps,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getOneResourceMap});
      next(e);
    }
  }

  async createOneResourceMap(req: Request, res: Response, next: NextFunction) {
    try {
      const toCreate: ResourceMapCreationAttributes = {
        ...req.body,
      };
      const createdResourceMap =
        await this.resourceMapService.createOneResourceMap(toCreate);
      res.status(201);
      res.json({
        message: userFriendlyMessages.success.createResourceMap,
        data: createdResourceMap,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.createResourceMap});
      next(e);
    }
  }

  async bulkCreateResourceMap(req: Request, res: Response, next: NextFunction) {
    try {
      const newResourceMaps: ResourceMapCreationAttributes[] = req.body;
      const createdResourceMaps =
        await this.resourceMapService.bulkCreateResourceMap(newResourceMaps);
      res.status(201);
      res.json({
        message: userFriendlyMessages.success.createResourceMap,
        data: createdResourceMaps,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.createResourceMap});
      next(e);
    }
  }

  async bulkDeleteResourceMap(req: Request, res: Response, next: NextFunction) {
    try {
      const {id} = req.body;
      const deletionFilter: DeleteOptions = {id: id};
      const deletedResourceMaps =
        await this.resourceMapService.bulkDeleteResourceMap(deletionFilter);
      res.json({
        message: userFriendlyMessages.success.deleteResourceMap,
        data: deletedResourceMaps,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.deleteResourceMap});
      next(e);
    }
  }

  async getAllResourceMaps(res: Response, next: NextFunction) {
    try {
      const resourceMaps =
        (await this.resourceMapService.getAllResourceMaps()) || [];
      res.json({
        message: userFriendlyMessages.success.getAllResourceMap,
        data: resourceMaps,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getAllResourceMap});
      next(e);
    }
  }

  async getOneResourceMapById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const resourceMap = await this.resourceMapService.getOneResourceMapById(
        id
      );
      res.json({
        message: userFriendlyMessages.success.getOneResourceMap,
        data: resourceMap,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getOneResourceMap});
      next(e);
    }
  }

  async deleteOneResourceMapById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);
      await this.resourceMapService.deleteOneResourceMapById(id);
      res.json({message: userFriendlyMessages.success.deleteResourceMap});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.deleteResourceMap});
      next(e);
    }
  }
}
