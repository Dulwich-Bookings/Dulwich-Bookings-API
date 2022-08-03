import express, {Request, Response, NextFunction} from 'express';

import MilestoneController from '../controllers/MilestoneController';
import Container from '../utils/container';
import roleValidator, {ADMINS} from '../middlewares/authorization';
import AuthenticationMiddleware from '../middlewares/authentication';

export default () => {
  const milestoneRouter = express.Router();
  const milestoneController: MilestoneController = Container.getInstance().get(
    'MilestoneController'
  );
  const authenticationMiddleware: AuthenticationMiddleware =
    Container.getInstance().get('AuthenticationMiddleware');

  const auth = (req: Request, res: Response, next: NextFunction) =>
    authenticationMiddleware.authentication(req, res, next);

  milestoneRouter.get(
    '/getSelf',
    [auth, roleValidator(ADMINS)],
    milestoneController.getSelf.bind(milestoneController)
  );

  milestoneRouter.post(
    '/bulkCreate',
    [auth, roleValidator(ADMINS)],
    milestoneController.bulkCreateMilestones.bind(milestoneController)
  );

  milestoneRouter.delete(
    '/bulkDelete',
    [auth, roleValidator(ADMINS)],
    milestoneController.bulkDeleteMilestones.bind(milestoneController)
  );

  return milestoneRouter;
};
