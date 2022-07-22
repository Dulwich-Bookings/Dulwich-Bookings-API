import express, {Request, Response, NextFunction} from 'express';

import SubscriptionController from '../controllers/SubscriptionController';
import Container from '../utils/container';
import AuthenticationMiddleware from '../middlewares/authentication';
import ResourceOwnerMiddleware from '../middlewares/resourceOwner';
import roleValidator, {ADMINS, TEACHERS} from '../middlewares/authorization';

export default () => {
  const subscriptionRouter = express.Router();
  const subscriptionController: SubscriptionController =
    Container.getInstance().get('SubscriptionController');
  const authenticationMiddleware: AuthenticationMiddleware =
    Container.getInstance().get('AuthenticationMiddleware');
  const resourceOwnerMiddleware: ResourceOwnerMiddleware =
    Container.getInstance().get('ResourceOwnerMiddleware');

  const auth = (req: Request, res: Response, next: NextFunction) =>
    authenticationMiddleware.authentication(req, res, next);
  const resourceOwner = resourceOwnerMiddleware.resourceOwner('Resource');

  subscriptionRouter.post(
    '/',
    [auth, roleValidator(TEACHERS)],
    subscriptionController.createOneSubscription.bind(subscriptionController)
  );

  subscriptionRouter.get(
    '/',
    [auth],
    (_: Request, res: Response, next: NextFunction) =>
      subscriptionController.getAllSubscriptions(res, next)
  );

  subscriptionRouter.get(
    '/:id',
    [auth],
    subscriptionController.getOneSubscriptionById.bind(subscriptionController)
  );

  subscriptionRouter.put(
    '/:id',
    [auth, resourceOwner, roleValidator(ADMINS)],
    subscriptionController.updateOneSubscriptionById.bind(
      subscriptionController
    )
  );

  subscriptionRouter.delete(
    '/:id',
    [auth, resourceOwner, roleValidator(ADMINS)],
    subscriptionController.deleteOneSubscriptionById.bind(
      subscriptionController
    )
  );

  return subscriptionRouter;
};
