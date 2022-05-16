import express, {Request, Response, NextFunction} from 'express';

import UserController from '../controllers/UserController';
import Container from '../utils/container';

export default () => {
  const userRouter = express.Router();
  const userController: UserController =
    Container.getInstance().get('UserController');

  userRouter.get('/', (_: Request, res: Response, next: NextFunction) =>
    userController.getAllUsers(res, next)
  );

  userRouter.get('/getSelf', userController.getSelf.bind(userController));

  userRouter.put('/updateSelf', userController.updateSelf.bind(userController));

  userRouter.put('/:id', userController.updateOneUserById.bind(userController));

  userRouter.delete(
    '/:id',
    userController.deleteOneUserById.bind(userController)
  );

  userRouter.delete(
    '/',
    userController.bulkDeleteUserById.bind(userController)
  );
  return userRouter;
};
