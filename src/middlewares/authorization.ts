import {Role} from '../models/User';
import {NextFunction, Request, Response} from 'express';
import {role} from '../consts/constants';

export const TEACHERS: Role[] = [role.TEACHER, role.ADMIN];
export const ADMINS: Role[] = [role.ADMIN];

// returns a middleware for doing tier-based permissions
export default function roleValidator(permittedRoles: Role[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (request.isSkipRoleValidator) {
      next();
    }

    const {user} = request;

    if (user && permittedRoles.includes(user.role)) {
      next();
    } else {
      response.status(403).json({message: 'Forbidden'});
    }
  };
}
