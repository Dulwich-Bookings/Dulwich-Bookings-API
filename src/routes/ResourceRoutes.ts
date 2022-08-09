import express, {Request, Response, NextFunction} from 'express';

import ResourceController from '../controllers/ResourceController';
import Container from '../utils/container';
import AuthenticationMiddleware from '../middlewares/authentication';
import roleValidator, {ADMINS, TEACHERS} from '../middlewares/authorization';
import ResourceOwnerMiddleware from '../middlewares/resourceOwner';

export default () => {
  const resourceRouter = express.Router();
  const resourceController: ResourceController =
    Container.getInstance().get('ResourceController');
  const authenticationMiddleware: AuthenticationMiddleware =
    Container.getInstance().get('AuthenticationMiddleware');
  const resourceOwnerMiddleware: ResourceOwnerMiddleware =
    Container.getInstance().get('ResourceOwnerMiddleware');

  const auth = (req: Request, res: Response, next: NextFunction) =>
    authenticationMiddleware.authentication(req, res, next);
  const resourceOwner = resourceOwnerMiddleware.resourceOwner('Resource');

  resourceRouter.post(
    '/',
    [auth, roleValidator(TEACHERS)],
    resourceController.createOneResource.bind(resourceController)
  );

  resourceRouter.get(
    '/',
    [auth],
    resourceController.getAllResources.bind(resourceController)
  );

  resourceRouter.get(
    '/:id',
    [auth],
    resourceController.getOneResourceById.bind(resourceController)
  );

  resourceRouter.put(
    '/:id',
    [auth, resourceOwner, roleValidator(ADMINS)],
    resourceController.updateOneResourceById.bind(resourceController)
  );

  resourceRouter.delete(
    '/:id',
    [auth, resourceOwner, roleValidator(ADMINS)],
    resourceController.deleteOneResourceById.bind(resourceController)
  );

  return resourceRouter;
};
