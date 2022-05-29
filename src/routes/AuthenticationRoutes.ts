import express from 'express';

import AuthenticationController from '../controllers/AuthenticationController';
import Container from '../utils/container';
import uploadFile from '../middlewares/uploadFile';
import parseCsv from '../middlewares/parseCsv';

export default () => {
  const authenticationRouter = express.Router();
  const authenticationController: AuthenticationController =
    Container.getInstance().get('AuthenticationController');

  authenticationRouter.post(
    '/signUp',
    authenticationController.signUp.bind(authenticationController)
  );

  authenticationRouter.post(
    '/confirmEmail',
    authenticationController.confirmEmail.bind(authenticationController)
  );

  authenticationRouter.post(
    '/bulkSignUp',
    [uploadFile, parseCsv],
    authenticationController.bulkSignUp.bind(authenticationController)
  );

  authenticationRouter.post(
    '/signIn',
    authenticationController.signIn.bind(authenticationController)
  );

  authenticationRouter.post(
    '/setPassword',
    authenticationController.setPassword.bind(authenticationController)
  );

  authenticationRouter.post(
    '/resetPassword',
    authenticationController.resetPassword.bind(authenticationController)
  );

  authenticationRouter.post(
    '/forgetPassword',
    authenticationController.forgetPasswordEmail.bind(authenticationController)
  );

  authenticationRouter.post(
    '/setForgetPassword',
    authenticationController.setPassword.bind(authenticationController)
  );

  return authenticationRouter;
};
