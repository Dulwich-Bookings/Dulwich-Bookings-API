import express, {Request, Response, NextFunction} from 'express';

import EmailController from '../controllers/EmailController';
import Container from '../utils/container';
import AuthenticationMiddleware from '../middlewares/authentication';

export default () => {
  const emailRouter = express.Router();
  const emailController: EmailController =
    Container.getInstance().get('EmailController');
  const authenticationMiddleware: AuthenticationMiddleware =
    Container.getInstance().get('AuthenticationMiddleware');

  const auth = (req: Request, res: Response, next: NextFunction) =>
    authenticationMiddleware.authentication(req, res, next);

  emailRouter.post('/', [auth], emailController.sendMail.bind(emailController));

  return emailRouter;
};
