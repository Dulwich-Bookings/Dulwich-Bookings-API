import {NextFunction, Request, Response} from 'express';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import {ResourceCreationAttributes} from '../models/Resource';
import ResourceService from '../services/ResourceService';

export default class ResourceController {
  private resourceService: ResourceService;
  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
  }

  async createOneResource(req: Request, res: Response, next: NextFunction) {
    try {
      const toCreate: ResourceCreationAttributes = {
        ...req.body,
      };
      const createdResource = await this.resourceService.createOneResource(
        toCreate
      );
      res.status(201);
      res.json({
        message: userFriendlyMessages.success.createResource,
        data: createdResource,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.createResource});
      next(e);
    }
  }

  async getAllResources(res: Response, next: NextFunction) {
    try {
      const resources = (await this.resourceService.getAllResources()) || [];
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
      const id = parseInt(req.params.id);
      const oldResource = await this.resourceService.getOneResourceById(id);
      const updatedAttributes = {...oldResource, ...req.body};
      const updatedResource = await this.resourceService.updateOneResourceById(
        id,
        updatedAttributes
      );
      res.json({
        message: userFriendlyMessages.success.updateResource,
        data: updatedResource,
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
