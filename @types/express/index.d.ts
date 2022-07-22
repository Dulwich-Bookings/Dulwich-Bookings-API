import {User} from '../../src/models';
import {BulkSignUpAttributes} from '../../src/models/User';

declare global {
  namespace Express {
    interface Request {
      user: User;
      bulkSignUpAttributes?: BulkSignUpAttributes[];
      isSkipRoleValidator?: boolean;
    }
  }
}
