import {NextFunction, Request, Response} from 'express';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import {BookmarkCreationAttributes} from '../models/Bookmark';
import BookmarkService from '../services/BookmarkService';

export default class BookmarkController {
  private bookmarkService: BookmarkService;
  constructor(bookmarkService: BookmarkService) {
    this.bookmarkService = bookmarkService;
  }

  async getSelf(req: Request, res: Response, next: NextFunction) {
    try {
      const {user} = req;
      if (!user) {
        res
          .status(400)
          .send({message: userFriendlyMessages.failure.userNotExist});
        return;
      }
      const userId = user.id;
      const selfBookmarks = await this.bookmarkService.getBookmarksByUserId(
        userId
      );
      res.json({
        message: userFriendlyMessages.success.getOneBookmark,
        data: selfBookmarks,
      });
    } catch (e) {
      next(e);
    }
  }

  async createOneBookmark(req: Request, res: Response, next: NextFunction) {
    try {
      const toCreate: BookmarkCreationAttributes = {
        ...req.body,
      };
      const createdBookmark = await this.bookmarkService.createOneBookmark(
        toCreate
      );
      res.status(201);
      res.json({
        message: userFriendlyMessages.success.createBookmark,
        data: createdBookmark,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.createBookmark});
      next(e);
    }
  }

  async getAllBookmarks(res: Response, next: NextFunction) {
    try {
      const bookmarks = (await this.bookmarkService.getAllBookmarks()) || [];
      res.json({
        message: userFriendlyMessages.success.getAllBookmarks,
        data: bookmarks,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getAllBookmarks});
      next(e);
    }
  }

  async getOneBookmarkById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const bookmark = await this.bookmarkService.getOneBookmarkById(id);
      res.json({
        message: userFriendlyMessages.success.getOneBookmark,
        data: bookmark,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getOneBookmark});
      next(e);
    }
  }

  async updateOneBookmarkById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const oldBookmark = await this.bookmarkService.getOneBookmarkById(id);
      const updatedAttributes = {
        ...oldBookmark,
        ...req.body,
      };
      const updatedBookmark = await this.bookmarkService.updateOneBookmarkById(
        id,
        updatedAttributes
      );
      res.json({
        message: userFriendlyMessages.success.updateBookmark,
        data: updatedBookmark,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.updateBookmark});
      next(e);
    }
  }

  async deleteOneBookmarkById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await this.bookmarkService.deleteOneBookmarkById(id);
      res.json({message: userFriendlyMessages.success.deleteBookmark});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.deleteBookmark});
      next(e);
    }
  }
}
