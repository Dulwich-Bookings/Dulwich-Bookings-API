import express, {Request, Response, NextFunction} from 'express';

import ResourceMapController from '../controllers/ResourceMapController';
import Container from '../utils/container';
import AuthenticationMiddleware from '../middlewares/authentication';
import ResourceMapOwnerMiddleware from '../middlewares/resourceMapOwner';
import roleValidator, {ADMINS, TEACHERS} from '../middlewares/authorization';

export default () => {
  const resourceMapRouter = express.Router();
  const resourceMapController: ResourceMapController =
    Container.getInstance().get('ResourceMapController');
  const authenticationMiddleware: AuthenticationMiddleware =
    Container.getInstance().get('AuthenticationMiddleware');
  const resourceMapOwnerMiddleware: ResourceMapOwnerMiddleware =
    Container.getInstance().get('ResourceMapOwnerMiddleware');

  const auth = (req: Request, res: Response, next: NextFunction) =>
    authenticationMiddleware.authentication(req, res, next);
  const resourceMapsOwner = resourceMapOwnerMiddleware.resourceMapsOwner;
  const resourceMapOwner = resourceMapOwnerMiddleware.resourceMapOwner;

  resourceMapRouter.post(
    '/bulkCreate',
    [auth, roleValidator(TEACHERS)],
    resourceMapController.bulkCreateResourceMap.bind(resourceMapController)
  );

  resourceMapRouter.post(
    '/',
    [auth, roleValidator(TEACHERS)],
    resourceMapController.createOneResourceMap.bind(resourceMapController)
  );

  resourceMapRouter.get(
    '/getSelf',
    [auth],
    resourceMapController.getSelf.bind(resourceMapController)
  );

  resourceMapRouter.get(
    '/:id',
    [auth],
    resourceMapController.getOneResourceMapById.bind(resourceMapController)
  );

  resourceMapRouter.get(
    '/',
    [auth],
    (_: Request, res: Response, next: NextFunction) =>
      resourceMapController.getAllResourceMaps(res, next)
  );

  resourceMapRouter.delete(
    '/bulkDelete',
    [auth, resourceMapsOwner, roleValidator(ADMINS)],
    resourceMapController.bulkDeleteResourceMap.bind(resourceMapController)
  );

  resourceMapRouter.delete(
    '/:id',
    [auth, resourceMapOwner, roleValidator(ADMINS)],
    resourceMapController.deleteOneResourceMapById.bind(resourceMapController)
  );

  return resourceMapRouter;
};
