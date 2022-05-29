import {NextFunction, Request, Response} from 'express';
import userFriendlyMessage from '../consts/userFriendlyMessages';
import UserService from '../services/UserService';
import EmailService from '../services/EmailService';
import JWTUtils from '../utils/jwtUtils';
import PasswordUtils from '../utils/passwordUtils';
import {
  Payload,
  Role,
  UserAttributes,
  UserCreationAttributes,
} from '../models/User';

export default class AuthenticationController {
  private userService: UserService;
  private emailService: EmailService;

  constructor(userService: UserService, emailService: EmailService) {
    this.userService = userService;
    this.emailService = emailService;
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const {email, password, passwordConfirmation} = req.body;
      const user = await this.userService.getOneUserByEmail(email);

      if (user) {
        res.status(400);
        res.json({message: userFriendlyMessage.failure.emailExists});
        return;
      }
      if (password !== passwordConfirmation) {
        res.status(400);
        res.json({
          message: userFriendlyMessage.failure.passwordConfirmationMismatch,
        });
        return;
      }

      const createdUser = await this.userService.createOneUser({
        ...req.body,
        role: 'Student',
        isConfirmed: false,
        isTemporary: false,
      });
      const payload: Payload = {
        id: createdUser.id,
        role: createdUser.role,
        schoolId: createdUser.schoolId,
        isConfirmed: createdUser.isConfirmed,
        isTemporary: createdUser.isTemporary,
      };
      const accessToken = JWTUtils.generateAccessToken(payload);
      // TODO: insert frontend url for confirm email.
      const url = `test.com?token=${accessToken}`;
      await this.emailService.sendConfirmEmail(email, url);
      res.json({
        message: userFriendlyMessage.success.createUser,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.createUser});
      next(e);
    }
  }

  async confirmEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.query.token as string;
      try {
        JWTUtils.verifyAccessToken(token);
      } catch (e) {
        res.status(401);
        res.json({message: userFriendlyMessage.failure.invalidToken});
        return;
      }
      const decoded = JWTUtils.getPayload(token);
      const {id} = decoded;
      const user = await this.userService.getOneUserById(id);

      if (!user) {
        res.status(400);
        res.json({message: userFriendlyMessage.failure.userNotExist});
      }

      const updatedAttributes: UserAttributes = {
        ...user,
        isConfirmed: true,
      };
      await this.userService.updateOneUserById(id, updatedAttributes);
      res.json({message: userFriendlyMessage.success.confirmEmail});
      // Redirect user to login page
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.confirmEmail});
      next(e);
    }
  }

  // Format for CSV file: [email], [role]
  // TODO: Output CSV containing [email], [role], [url]
  async bulkSignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const userAttributes = req.parsedUserAttributes;

      if (!userAttributes) {
        res.status(400);
        res.json({message: userFriendlyMessage.failure.userAttributes});
        return;
      }

      //TODO: Auth Middleware will add the current user in req.user
      const {user} = req;
      const userCreationAttributes: UserCreationAttributes[] = [];

      for (const attribute of userAttributes) {
        const email = attribute[0];
        const role = attribute[1] as Role;
        const user = await this.userService.getOneUserByEmail(email);

        if (user) {
          res.status(400);
          res.json({
            email: email,
            message: userFriendlyMessage.failure.emailExists,
          });
          return;
        }
        userCreationAttributes.push({
          email: email,
          password: PasswordUtils.generateRandomPassword(),
          role: role,
          schoolId: 1,
          // TODO: Uncomment below after implementation of auth middleware
          // schoolId: user.schoolId,
          isConfirmed: false,
          isTemporary: true,
        });
      }

      const createdUsers = await this.userService.bulkCreateUser(
        userCreationAttributes
      );
      const emailParams = createdUsers.map(createdUser => {
        const payload: Payload = {
          id: createdUser.id,
          role: createdUser.role,
          schoolId: createdUser.schoolId,
          isConfirmed: createdUser.isConfirmed,
          isTemporary: createdUser.isTemporary,
        };
        const accessToken = JWTUtils.generateSetPasswordAccessToken(
          payload,
          createdUser.password
        );
        // TODO: insert frontend url for confirm email.
        const url = `test.com?token=${accessToken}`;
        return {
          to: createdUser.email,
          url: url,
        };
      });
      await this.emailService.sendSetPasswordEmail(emailParams);
      res.json({message: userFriendlyMessage.success.createUser});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.createUser});
      next(e);
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const {email, password} = req.body;
      const user = await this.userService.getOneUserByEmail(email, true);

      if (!user) {
        res.status(401);
        res.json({message: userFriendlyMessage.failure.emailNotExist});
        return;
      }
      if (user.isTemporary) {
        res.status(401);
        res.json({message: userFriendlyMessage.failure.userIsTemporary});
        return;
      }
      if (!user.isPasswordMatch(password)) {
        res.status(401);
        res.json({message: userFriendlyMessage.failure.incorrectPassword});
        return;
      }
      if (!user.isConfirmed) {
        res.status(401);
        res.json({message: userFriendlyMessage.failure.emailNotConfirmed});
        return;
      }

      const payload: Payload = {
        id: user.id,
        role: user.role,
        schoolId: user.schoolId,
        isConfirmed: user.isConfirmed,
        isTemporary: user.isTemporary,
      };
      const accessToken = JWTUtils.generateAccessToken(payload);

      res.json({
        message: userFriendlyMessage.success.signIn,
        data: {
          accessToken: accessToken,
        },
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.signIn});
      next(e);
    }
  }

  async setPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.query.token as string;
      const decoded = JWTUtils.getPayload(token);
      const {id} = decoded;
      const user = await this.userService.getOneUserById(id);

      if (!user) {
        res.status(400);
        res.json({message: userFriendlyMessage.failure.userNotExist});
        return;
      }

      try {
        JWTUtils.verifySetPasswordAccessToken(token, user.password);
      } catch (e) {
        res.status(401);
        res.json({message: userFriendlyMessage.failure.invalidToken});
        return;
      }

      const {password, passwordConfirmation} = req.body;

      if (password !== passwordConfirmation) {
        res.status(400);
        res.json({
          message: userFriendlyMessage.failure.passwordConfirmationMismatch,
        });
        return;
      }

      const updatedAttributes: UserAttributes = {
        ...user,
        password: password,
        isConfirmed: true,
        isTemporary: false,
      };
      await this.userService.updateOneUserById(id, updatedAttributes);
      res.json({message: userFriendlyMessage.success.setPassword});
      // Redirect user to login page
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.setPassword});
      next(e);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      //TODO: Auth Middleware will add the current user in req.user
      const {user} = req;
      const {originalPassword, newPassword, newPasswordConfirmation} = req.body;

      if (!user) {
        res.status(400);
        res.json({message: userFriendlyMessage.failure.userNotExist});
        return;
      }
      if (!(await user.isPasswordMatch(originalPassword))) {
        res.status(401);
        res.json({message: userFriendlyMessage.failure.incorrectPassword});
        return;
      }
      if (newPassword !== newPasswordConfirmation) {
        res.status(400);
        res.json({
          message: userFriendlyMessage.failure.passwordConfirmationMismatch,
        });
        return;
      }

      const id = user.id;
      const updatedAttributes: UserAttributes = {
        ...user,
        password: newPassword,
      };
      const updatedUser = await this.userService.updateOneUserById(
        id,
        updatedAttributes
      );
      res.json({
        message: userFriendlyMessage.success.resetPassword,
        data: updatedUser,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.resetPassword});
      next(e);
    }
  }

  async forgetPasswordEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const {email} = req.body;
      const user = await this.userService.getOneUserByEmail(email);

      if (!user) {
        res.status(400);
        res.json({message: userFriendlyMessage.failure.emailNotExist});
        return;
      }

      const payload: Payload = {
        id: user.id,
        role: user.role,
        schoolId: user.schoolId,
        isConfirmed: user.isConfirmed,
        isTemporary: user.isTemporary,
      };
      const accessToken = JWTUtils.generateSetPasswordAccessToken(
        payload,
        user.password,
        {expiresIn: '30m'}
      );
      // TODO: Insert frontend url to set password.
      const url = `test.com?token=${accessToken}`;
      await this.emailService.sendResetForgotPasswordEmail(email, url);
      res.json({message: userFriendlyMessage.success.sendForgetPasswordEmail});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.sendEmail});
      next(e);
    }
  }
}
