import express, {Request, Response, NextFunction} from 'express';

import BookmarkController from '../controllers/BookmarkController';
import Container from '../utils/container';
import AuthenticationMiddleware from '../middlewares/authentication';
import roleValidator, {ADMINS} from '../middlewares/authorization';

export default () => {
  const bookmarkRouter = express.Router();
  const bookmarkController: BookmarkController =
    Container.getInstance().get('BookmarkController');
  const authenticationMiddleware: AuthenticationMiddleware =
    Container.getInstance().get('AuthenticationMiddleware');

  const auth = (req: Request, res: Response, next: NextFunction) =>
    authenticationMiddleware.authentication(req, res, next);

  bookmarkRouter.get(
    '/getSelf',
    [auth],
    bookmarkController.getSelf.bind(bookmarkController)
  );

  bookmarkRouter.post(
    '/',
    [auth],
    bookmarkController.createOneBookmark.bind(bookmarkController)
  );

  bookmarkRouter.get(
    '/',
    [auth],
    (_: Request, res: Response, next: NextFunction) =>
      bookmarkController.getAllBookmarks(res, next)
  );

  bookmarkRouter.get(
    '/:id',
    [auth],
    bookmarkController.getOneBookmarkById.bind(bookmarkController)
  );

  bookmarkRouter.put(
    '/:id',
    // add middleware
    [auth, roleValidator(ADMINS)],
    bookmarkController.updateOneBookmarkById.bind(bookmarkController)
  );

  bookmarkRouter.delete(
    '/:id',
    // add middleware
    [auth, roleValidator(ADMINS)],
    bookmarkController.deleteOneBookmarkById.bind(bookmarkController)
  );

  return bookmarkRouter;
};
