import express, {Request, Response, NextFunction} from 'express';

import UserController from '../controllers/UserController';
import Container from '../utils/container';
import AuthenticationMiddleware from '../middlewares/authentication';
import roleValidator, {ADMINS} from '../middlewares/authorization';

export default () => {
  const userRouter = express.Router();
  const userController: UserController =
    Container.getInstance().get('UserController');
  const authenticationMiddleware: AuthenticationMiddleware =
    Container.getInstance().get('AuthenticationMiddleware');

  const auth = (req: Request, res: Response, next: NextFunction) =>
    authenticationMiddleware.authentication(req, res, next);

  userRouter.get('/', [auth], (_: Request, res: Response, next: NextFunction) =>
    userController.getAllUsers(res, next)
  );

  userRouter.get(
    '/getSelf',
    [auth],
    (req: Request, res: Response, next: NextFunction) =>
      userController.getSelf(req, res, next)
  );

  userRouter.put(
    '/updateSelf',
    [auth],
    userController.updateSelf.bind(userController)
  );

  userRouter.get(
    '/:id',
    [auth],
    userController.getOneUserById.bind(userController)
  );

  userRouter.put(
    '/:id',
    [auth, roleValidator(ADMINS)],
    userController.updateOneUserById.bind(userController)
  );

  userRouter.delete(
    '/:id',
    [auth, roleValidator(ADMINS)],
    userController.deleteOneUserById.bind(userController)
  );

  userRouter.delete(
    '/',
    [auth, roleValidator(ADMINS)],
    userController.bulkDeleteUserById.bind(userController)
  );
  return userRouter;
};
