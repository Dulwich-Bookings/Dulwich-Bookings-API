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
    '/:id',
    [auth],
    resourceBookingController.updateOneResourceBookingById.bind(
      resourceBookingController
    )
  );

  resourceBookingRouter.delete(
    '/:id',
    [auth],
    resourceBookingController.deleteOneResourceBookingById.bind(
      resourceBookingController
    )
  );

  return resourceBookingRouter;
};
