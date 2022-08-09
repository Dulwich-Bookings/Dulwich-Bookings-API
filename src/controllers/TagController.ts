import {NextFunction, Request, Response} from 'express';
import userFriendlyMessage from '../consts/userFriendlyMessages';
import {TagAttributes, TagCreationAttributes} from '../models/Tag';
import TagService from '../services/TagService';

export default class TagController {
  private tagService: TagService;

  constructor(tagService: TagService) {
    this.tagService = tagService;
  }

  async getAllTags(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user.schoolId;
      const tags = (await this.tagService.getAllTags(schoolId)) || [];
      res.json({message: userFriendlyMessage.success.getAllTags, data: tags});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.getAllTags});
      next(e);
    }
  }

  async getOneTagById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const tag = (await this.tagService.getOneTagById(id))[0];
      res.json({message: userFriendlyMessage.success.getOneTag, data: tag});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.getOneTag});
      next(e);
    }
  }

  async createOneTag(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user.schoolId;
      const toCreate: TagCreationAttributes = {
        ...req.body,
        schoolId,
      };
      const createdTag = await this.tagService.createOneTag(toCreate);
      res.status(201);
      res.json({
        message: userFriendlyMessage.success.createTag,
        data: createdTag,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.createTag});
      next(e);
    }
  }

  async updateOneTagById(req: Request, res: Response, next: NextFunction) {
    try {
      const tagId = parseInt(req.params.id);
      const oldTag = await this.tagService.getOneTagById(tagId);
      const toUpdate: TagAttributes = {
        ...oldTag,
        ...req.body,
      };

      const tag = await this.tagService.updateOneTagById(tagId, toUpdate);
      res.json({message: userFriendlyMessage.success.updateTag, data: tag});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.updateTag});
      next(e);
    }
  }

  async deleteOneTagById(req: Request, res: Response, next: NextFunction) {
    try {
      const tagId = parseInt(req.params.id);
      await this.tagService.deleteOneTagById(tagId);
      res.json({message: userFriendlyMessage.success.deleteTag});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.deleteTag});
      next(e);
    }
  }
}
