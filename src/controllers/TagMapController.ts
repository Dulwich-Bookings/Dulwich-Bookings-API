import {NextFunction, Request, Response} from 'express';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import {TagMapCreationAttributes} from '../models/TagMap';
import TagMapService from '../services/TagMapService';
import {DeleteOptions} from '../services/UserService';

export default class TagMapController {
  private tagMapService: TagMapService;
  constructor(tagMapService: TagMapService) {
    this.tagMapService = tagMapService;
  }

  async createOneTagMap(req: Request, res: Response, next: NextFunction) {
    try {
      const toCreate: TagMapCreationAttributes = {
        ...req.body,
      };
      const createdTagMap = await this.tagMapService.createOneTagMap(toCreate);
      res.status(201);
      res.json({
        message: userFriendlyMessages.success.createTagMap,
        data: createdTagMap,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.createTagMap});
      next(e);
    }
  }

  async bulkCreateTagMap(req: Request, res: Response, next: NextFunction) {
    try {
      const newTagMaps: TagMapCreationAttributes[] = req.body;
      const createdTagMaps = await this.tagMapService.bulkCreateTagMap(
        newTagMaps
      );
      res.status(201);
      res.json({
        message: userFriendlyMessages.success.createTagMap,
        data: createdTagMaps,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.createTagMap});
      next(e);
    }
  }

  async bulkDeleteTagMap(req: Request, res: Response, next: NextFunction) {
    try {
      const {id} = req.body;
      const deletionFilter: DeleteOptions = {id: id};
      const deletedTagMaps = await this.tagMapService.bulkDeleteTagMap(
        deletionFilter
      );
      res.json({
        message: userFriendlyMessages.success.deleteTagMap,
        data: deletedTagMaps,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.deleteTagMap});
      next(e);
    }
  }

  async getAllTagMaps(res: Response, next: NextFunction) {
    try {
      const tagMaps = (await this.tagMapService.getAllTagMaps()) || [];
      res.json({
        message: userFriendlyMessages.success.getAllTagMap,
        data: tagMaps,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getAllTagMap});
      next(e);
    }
  }

  async getOneTagMapById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const tagMap = await this.tagMapService.getOneTagMapById(id);
      res.json({
        message: userFriendlyMessages.success.getOneTagMap,
        data: tagMap,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getOneTagMap});
      next(e);
    }
  }

  async deleteOneTagMapById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await this.tagMapService.deleteOneTagMapById(id);
      res.json({message: userFriendlyMessages.success.deleteTagMap});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.deleteTagMap});
      next(e);
    }
  }
}
