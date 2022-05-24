import express from 'express';

import AuthenticationController from '../controllers/AuthenticationController';
import Container from '../utils/container';

export default () => {
  const authenticationRouter = express.Router();
  const authenticationController: AuthenticationController =
    Container.getInstance().get('AuthenticationController');

  authenticationRouter.post(
    '/signUp',
    authenticationController.createUser.bind(authenticationController)
  );

  authenticationRouter.post(
    '/bulkSignUp',
    authenticationController.bulkCreateUserWithTempPassword.bind(
      authenticationController
    )
  );

  authenticationRouter.post(
    '/signIn',
    authenticationController.signIn.bind(authenticationController)
  );

  authenticationRouter.post(
    '/setPassword',
    authenticationController.updatePassword.bind(authenticationController)
  );

  authenticationRouter.post(
    '/forgetPassword',
    authenticationController.forgetPasswordEmail.bind(authenticationController)
  );

  return authenticationRouter;
};
