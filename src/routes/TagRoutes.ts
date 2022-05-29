import express, {Request, Response, NextFunction} from 'express';

import TagController from '../controllers/TagController';
import Container from '../utils/container';
import AuthenticationMiddleware from '../middlewares/authentication';

export default () => {
  const tagRouter = express.Router();
  const tagController: TagController =
    Container.getInstance().get('TagController');
  const authenticationMiddleware: AuthenticationMiddleware =
    Container.getInstance().get('AuthenticationMiddleware');

  const auth = (req: Request, res: Response, next: NextFunction) =>
    authenticationMiddleware.authentication(req, res, next);

  tagRouter.get('/', [auth], (_: Request, res: Response, next: NextFunction) =>
    tagController.getAllTags(res, next)
  );
  tagRouter.get(
    '/:id',
    [auth],
    tagController.getOneTagById.bind(tagController)
  );
  tagRouter.post('/', [auth], tagController.createOneTag.bind(tagController));
  tagRouter.put(
    '/:id',
    [auth],
    tagController.updateOneTagById.bind(tagController)
  );
  tagRouter.delete(
    '/:id',
    [auth],
    tagController.deleteOneTagById.bind(tagController)
  );

  return tagRouter;
};
