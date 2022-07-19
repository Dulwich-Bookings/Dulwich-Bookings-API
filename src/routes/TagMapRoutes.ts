import express, {Request, Response, NextFunction} from 'express';

import TagMapController from '../controllers/TagMapController';
import Container from '../utils/container';
import AuthenticationMiddleware from '../middlewares/authentication';
import roleValidator, {TEACHERS} from '../middlewares/authorization';

export default () => {
  const tagMapRouter = express.Router();
  const tagMapController: TagMapController =
    Container.getInstance().get('TagMapController');
  const authenticationMiddleware: AuthenticationMiddleware =
    Container.getInstance().get('AuthenticationMiddleware');

  const auth = (req: Request, res: Response, next: NextFunction) =>
    authenticationMiddleware.authentication(req, res, next);

  tagMapRouter.post(
    '/bulkCreate',
    [auth, roleValidator(TEACHERS)],
    tagMapController.bulkCreateTagMap.bind(tagMapController)
  );

  tagMapRouter.post(
    '/',
    [auth, roleValidator(TEACHERS)],
    tagMapController.createOneTagMap.bind(tagMapController)
  );

  tagMapRouter.get(
    '/',
    [auth],
    (_: Request, res: Response, next: NextFunction) =>
      tagMapController.getAllTagMaps(res, next)
  );

  tagMapRouter.get(
    '/:id',
    [auth],
    tagMapController.getOneTagMapById.bind(tagMapController)
  );

  tagMapRouter.delete(
    '/bulkDelete',
    [auth, roleValidator(TEACHERS)],
    tagMapController.bulkDeleteTagMap.bind(tagMapController)
  );

  tagMapRouter.delete(
    '/:id',
    [auth, roleValidator(TEACHERS)],
    tagMapController.deleteOneTagMapById.bind(tagMapController)
  );

  return tagMapRouter;
};
