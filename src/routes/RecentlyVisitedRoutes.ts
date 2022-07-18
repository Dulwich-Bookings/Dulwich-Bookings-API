import express, {Request, Response, NextFunction} from 'express';

import RecentlyVisitedController from '../controllers/RecentlyVisitedController';
import Container from '../utils/container';
import AuthenticationMiddleware from '../middlewares/authentication';

export default () => {
  const recentlyVisitedRouter = express.Router();
  const recentlyVisitedController: RecentlyVisitedController =
    Container.getInstance().get('RecentlyVisitedController');
  const authenticationMiddleware: AuthenticationMiddleware =
    Container.getInstance().get('AuthenticationMiddleware');

  const auth = (req: Request, res: Response, next: NextFunction) =>
    authenticationMiddleware.authentication(req, res, next);

  recentlyVisitedRouter.get(
    '/getSelf',
    [auth],
    recentlyVisitedController.getSelf.bind(recentlyVisitedController)
  );

  recentlyVisitedRouter.post(
    '/',
    [auth],
    recentlyVisitedController.createOneRecentlyVisited.bind(
      recentlyVisitedController
    )
  );

  recentlyVisitedRouter.get(
    '/',
    [auth],
    (_: Request, res: Response, next: NextFunction) =>
      recentlyVisitedController.getAllRecentlyVisiteds(res, next)
  );

  recentlyVisitedRouter.get(
    '/:id',
    [auth],
    recentlyVisitedController.getOneRecentlyVisitedById.bind(
      recentlyVisitedController
    )
  );

  recentlyVisitedRouter.put(
    '/:id',
    [auth],
    recentlyVisitedController.updateOneRecentlyVisitedById.bind(
      recentlyVisitedController
    )
  );

  recentlyVisitedRouter.delete(
    '/:id',
    [auth],
    recentlyVisitedController.deleteOneRecentlyVisitedById.bind(
      recentlyVisitedController
    )
  );

  return recentlyVisitedRouter;
};
