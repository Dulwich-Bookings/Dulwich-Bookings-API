import express from 'express';

import EmailController from '../controllers/EmailController';
import Container from '../utils/container';

export default () => {
  const emailRouter = express.Router();
  const emailController: EmailController =
    Container.getInstance().get('EmailController');

  emailRouter.post('/', emailController.sendMail.bind(emailController));

  return emailRouter;
};
