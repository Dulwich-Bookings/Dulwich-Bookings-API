import {Role} from '../models/User';
import {NextFunction, Request, Response} from 'express';

export const TEACHERS: Role[] = ['Teacher', 'Admin'];
export const ADMINS: Role[] = ['Admin'];

// returns a middleware for doing tier-based permissions
export default function roleValidator(permittedRoles: Role[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const {user} = request;

    if (user && permittedRoles.includes(user.role)) {
      next();
    } else {
      response.status(403).json({message: 'Forbidden'});
    }
  };
}
