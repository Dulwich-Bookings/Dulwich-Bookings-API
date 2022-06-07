import express, {Request, Response, NextFunction} from 'express';

import ResourceController from '../controllers/ResourceController';
import Container from '../utils/container';
import AuthenticationMiddleware from '../middlewares/authentication';
import roleValidator, {ADMINS} from '../middlewares/authorization';

export default () => {
  const resourceRouter = express.Router();
  const resourceController: ResourceController =
    Container.getInstance().get('ResourceController');
  const authenticationMiddleware: AuthenticationMiddleware =
    Container.getInstance().get('AuthenticationMiddleware');

  const auth = (req: Request, res: Response, next: NextFunction) =>
    authenticationMiddleware.authentication(req, res, next);

  resourceRouter.post(
    '/',
    [auth],
    resourceController.createOneResource.bind(resourceController)
  );

  resourceRouter.get(
    '/',
    [auth],
    (_: Request, res: Response, next: NextFunction) =>
      resourceController.getAllResources(res, next)
  );

  resourceRouter.get(
    '/:id',
    [auth],
    resourceController.getOneResourceById.bind(resourceController)
  );

  resourceRouter.put(
    '/:id',
    [auth, roleValidator(ADMINS)],
    resourceController.updateOneResourceById.bind(resourceController)
  );

  resourceRouter.delete(
    '/:id',
    [auth, roleValidator(ADMINS)],
    resourceController.deleteOneResourceById.bind(resourceController)
  );

  return resourceRouter;
};
