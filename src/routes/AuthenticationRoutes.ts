import express, {Request, Response, NextFunction} from 'express';

import AuthenticationController from '../controllers/AuthenticationController';
import Container from '../utils/container';
import uploadFile from '../middlewares/uploadFile';
import parseBulkUserCsv from '../middlewares/parseBulkUserCsv';
import AuthenticationMiddleware from '../middlewares/authentication';
import roleValidator, {ADMINS} from '../middlewares/authorization';

export default () => {
  const authenticationRouter = express.Router();
  const authenticationController: AuthenticationController =
    Container.getInstance().get('AuthenticationController');
  const authenticationMiddleware: AuthenticationMiddleware =
    Container.getInstance().get('AuthenticationMiddleware');

  const auth = (req: Request, res: Response, next: NextFunction) =>
    authenticationMiddleware.authentication(req, res, next);

  const authChangePassword = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => authenticationMiddleware.authentication(req, res, next, true, true);

  const authShowPassword = (req: Request, res: Response, next: NextFunction) =>
    authenticationMiddleware.authentication(req, res, next, false, true);

  authenticationRouter.post(
    '/signUp',
    authenticationController.signUp.bind(authenticationController)
  );

  authenticationRouter.post(
    '/confirmEmail',
    [auth],
    authenticationController.confirmEmail.bind(authenticationController)
  );

  authenticationRouter.post(
    '/bulkSignUp',
    [auth, roleValidator(ADMINS), uploadFile, parseBulkUserCsv],
    authenticationController.bulkSignUp.bind(authenticationController)
  );

  authenticationRouter.post(
    '/signIn',
    authenticationController.signIn.bind(authenticationController)
  );

  authenticationRouter.post(
    '/setPassword',
    [authChangePassword],
    authenticationController.setPassword.bind(authenticationController)
  );

  authenticationRouter.post(
    '/resetPassword',
    [authShowPassword],
    authenticationController.resetPassword.bind(authenticationController)
  );

  authenticationRouter.post(
    '/forgetPassword',
    authenticationController.forgetPasswordEmail.bind(authenticationController)
  );

  return authenticationRouter;
};
