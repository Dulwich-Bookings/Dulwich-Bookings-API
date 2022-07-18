import express, {Request, Response, NextFunction} from 'express';

import SubscriptionController from '../controllers/SubscriptionController';
import Container from '../utils/container';
import AuthenticationMiddleware from '../middlewares/authentication';
import roleValidator, {ADMINS, TEACHERS} from '../middlewares/authorization';

export default () => {
  const subscriptionRouter = express.Router();
  const subscriptionController: SubscriptionController =
    Container.getInstance().get('SubscriptionController');
  const authenticationMiddleware: AuthenticationMiddleware =
    Container.getInstance().get('AuthenticationMiddleware');

  const auth = (req: Request, res: Response, next: NextFunction) =>
    authenticationMiddleware.authentication(req, res, next);

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
    // add middleware
    [auth, roleValidator(ADMINS)],
    subscriptionController.updateOneSubscriptionById.bind(
      subscriptionController
    )
  );

  subscriptionRouter.delete(
    '/:id',
    // add middleware
    [auth, roleValidator(ADMINS)],
    subscriptionController.deleteOneSubscriptionById.bind(
      subscriptionController
    )
  );

  return subscriptionRouter;
};
