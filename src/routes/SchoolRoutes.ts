import express, {Request, Response, NextFunction} from 'express';

import SchoolController from '../controllers/SchoolController';
import Container from '../utils/container';
import AuthenticationMiddleware from '../middlewares/authentication';
import roleValidator, {ADMINS} from '../middlewares/authorization';

export default () => {
  const schoolRouter = express.Router();
  const schoolController: SchoolController =
    Container.getInstance().get('SchoolController');
  const authenticationMiddleware: AuthenticationMiddleware =
    Container.getInstance().get('AuthenticationMiddleware');

  const auth = (req: Request, res: Response, next: NextFunction) =>
    authenticationMiddleware.authentication(req, res, next);

  schoolRouter.post(
    '/',
    [auth, roleValidator(ADMINS)],
    schoolController.createOneSchool.bind(schoolController)
  );

  schoolRouter.get('/', (_: Request, res: Response, next: NextFunction) =>
    schoolController.getAllSchools(res, next)
  );

  schoolRouter.get(
    '/:id',
    [auth],
    schoolController.getOneSchoolById.bind(schoolController)
  );

  schoolRouter.put(
    '/:id',
    [auth, roleValidator(ADMINS)],
    schoolController.updateOneSchoolById.bind(schoolController)
  );

  schoolRouter.delete(
    '/:id',
    [auth, roleValidator(ADMINS)],
    schoolController.deleteOneSchoolById.bind(schoolController)
  );

  return schoolRouter;
};
