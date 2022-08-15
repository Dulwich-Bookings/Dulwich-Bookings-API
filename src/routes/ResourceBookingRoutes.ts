import express, {Request, Response, NextFunction} from 'express';

import ResourceBookingController from '../controllers/ResourceBookingController';
import Container from '../utils/container';
import AuthenticationMiddleware from '../middlewares/authentication';

export default () => {
  const resourceBookingRouter = express.Router();
  const resourceBookingController: ResourceBookingController =
    Container.getInstance().get('ResourceBookingController');
  const authenticationMiddleware: AuthenticationMiddleware =
    Container.getInstance().get('AuthenticationMiddleware');

  const auth = (req: Request, res: Response, next: NextFunction) =>
    authenticationMiddleware.authentication(req, res, next);

  resourceBookingRouter.post(
    '/',
    [auth],
    resourceBookingController.createOneResourceBooking.bind(
      resourceBookingController
    )
  );

  resourceBookingRouter.get(
    '/',
    [auth],
    resourceBookingController.getAllResourceBookings.bind(
      resourceBookingController
    )
  );

  resourceBookingRouter.get(
    '/self',
    [auth],
    resourceBookingController.getMyResourceBookings.bind(
      resourceBookingController
    )
  );

  resourceBookingRouter.get(
    '/:id',
    [auth],
    resourceBookingController.getOneResourceBookingById.bind(
      resourceBookingController
    )
  );

  resourceBookingRouter.put(
    'thisEvent/:id',
    [auth],
    resourceBookingController.updateThisEvent.bind(resourceBookingController)
  );

  resourceBookingRouter.put(
    'thisAndFollowingEvents/:id',
    [auth],
    resourceBookingController.updateThisAndFollowingEvents.bind(
      resourceBookingController
    )
  );

  resourceBookingRouter.put(
    'allEvents/:id',
    [auth],
    resourceBookingController.updateAllEvents.bind(resourceBookingController)
  );

  resourceBookingRouter.delete(
    'thisEvent/:id',
    [auth],
    resourceBookingController.deleteThisEvent.bind(resourceBookingController)
  );

  resourceBookingRouter.delete(
    'thisAndFollowingEvents/:id',
    [auth],
    resourceBookingController.deleteThisAndFollowingEvents.bind(
      resourceBookingController
    )
  );

  resourceBookingRouter.delete(
    'allEvents/:id',
    [auth],
    resourceBookingController.deleteAllEvents.bind(resourceBookingController)
  );

  return resourceBookingRouter;
};
