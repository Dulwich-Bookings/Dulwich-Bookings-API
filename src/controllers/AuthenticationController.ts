import {NextFunction, Request, Response} from 'express';
import userFriendlyMessage from '../consts/userFriendlyMessages';
import UserService from '../services/UserService';
import EmailService from '../services/EmailService';
import JWTUtils from '../utils/jwtUtils';
import PasswordUtils from '../utils/passwordUtils';
import enviroment from '../consts/enviroment';
import {
  InvalidUserClassError,
  InvalidUserPasswordError,
  Payload,
  UserAttributes,
  UserCreationAttributes,
} from '../models/User';
import {role} from '../consts/constants';

export default class AuthenticationController {
  private userService: UserService;
  private emailService: EmailService;

  constructor(userService: UserService, emailService: EmailService) {
    this.userService = userService;
    this.emailService = emailService;
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const {schoolId, password, passwordConfirmation} = req.body;
      const email = req.body.email.toLowerCase();
      const user = await this.userService.getOneUserByEmailAndSchoolId(
        email,
        schoolId
      );

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
        role: role.STUDENT,
        isConfirmed: false,
        isTemporary: false,
      });
      const payload: Payload = {
        id: createdUser.id,
      };
      const accessToken = JWTUtils.generateAccessToken(payload);
      // TODO: insert frontend url for confirm email.
      const url = `${enviroment.frontendUrl}/auth/confirmEmail?token=${accessToken}`;
      await this.emailService.sendConfirmEmail(email, url);
      res.json({
        message: userFriendlyMessage.success.createUser,
      });
    } catch (e) {
      res.status(400);
      if (e instanceof InvalidUserClassError || InvalidUserPasswordError) {
        res.json({message: (e as Error).message});
      } else {
        res.json({message: userFriendlyMessage.failure.createUser});
      }
      next(e);
    }
  }

  async confirmEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const {user} = req;
      if (!user) {
        res.status(400);
        res.json({message: userFriendlyMessage.failure.userNotExist});
      }
      const updatedAttributes: UserAttributes = {
        ...user,
        isConfirmed: true,
      };
      await this.userService.updateOneUserById(user.id, updatedAttributes);

      // Redirect user to login page
      res.json({message: userFriendlyMessage.success.confirmEmail});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.confirmEmail});
      next(e);
    }
  }

  // TODO: Output CSV containing [email], [role], [class?], [url]
  async bulkSignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const signUpAttributes = req.bulkSignUpAttributes;
      if (!signUpAttributes) {
        res.status(400);
        res.json({message: userFriendlyMessage.failure.signUpAttributes});
        return;
      }

      const currentUser = req.user;
      const emails: string[] = signUpAttributes.map(user =>
        user.email.toLowerCase()
      );

      const existingUsers =
        await this.userService.bulkGetUserByEmailsAndSchoolId(
          emails,
          currentUser.schoolId
        );
      const exisitingEmails: string[] = existingUsers.map(user => user.email);
      const usersExist = existingUsers.length !== 0;

      if (usersExist) {
        res.status(400);
        res.json({
          emails: exisitingEmails,
          message: userFriendlyMessage.failure.emailExists,
        });
        return;
      }

      const userCreationAttributes: UserCreationAttributes[] =
        signUpAttributes.map(user => {
          return {
            email: user.email,
            password: PasswordUtils.generateRandomPassword(),
            role: user.role,
            schoolId: currentUser.schoolId,
            isConfirmed: true,
            isTemporary: true,
            class: user.class,
          };
        });

      const createdUsers = await this.userService.bulkCreateUser(
        userCreationAttributes
      );
      const emailParams = createdUsers.map(createdUser => {
        const payload: Payload = {
          id: createdUser.id,
        };
        const accessToken = JWTUtils.generateSetPasswordAccessToken(
          payload,
          createdUser.password
        );
        const url = `${enviroment.frontendUrl}/auth/setPassword?token=${accessToken}`;
        return {
          to: createdUser.email,
          url: url,
        };
      });
      await this.emailService.sendSetPasswordEmail(emailParams);
      res.json({message: userFriendlyMessage.success.createUser});
    } catch (e) {
      res.status(400);
      if (e instanceof InvalidUserClassError || InvalidUserPasswordError) {
        res.json({message: (e as Error).message});
      } else {
        res.json({message: userFriendlyMessage.failure.createUser});
      }
      next(e);
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const {password, schoolId} = req.body;
      const email = req.body.email.toLowerCase();
      const user = await this.userService.getOneUserByEmailAndSchoolId(
        email,
        schoolId,
        true
      );

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
      if (!(await user.isPasswordMatch(password))) {
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
      const {user} = req;
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
      await this.userService.updateOneUserById(user.id, updatedAttributes);
      res.json({message: userFriendlyMessage.success.setPassword});
      // Redirect user to login page
    } catch (e) {
      res.status(400);
      if (e instanceof InvalidUserPasswordError) {
        res.json({message: e.message});
      } else {
        res.json({message: userFriendlyMessage.failure.setPassword});
      }
      next(e);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const {user} = req;
      const {originalPassword, newPassword, newPasswordConfirmation} = req.body;

      if (user.isTemporary) {
        res.status(400);
        res.json({message: userFriendlyMessage.failure.userIsTemporary});
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
      if (await user.isPasswordMatch(newPassword)) {
        res.status(400);
        res.json({
          message: userFriendlyMessage.failure.samePasswordError,
        });
        return;
      }

      const id = user.id;
      const updatedAttributes: UserAttributes = {
        ...user,
        password: newPassword,
      };
      await this.userService.updateOneUserById(id, updatedAttributes);
      res.json({
        message: userFriendlyMessage.success.resetPassword,
      });
    } catch (e) {
      res.status(400);
      if (e instanceof InvalidUserPasswordError) {
        res.json({message: e.message});
      } else {
        res.json({message: userFriendlyMessage.failure.setPassword});
      }
      next(e);
    }
  }

  async forgetPasswordEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const {schoolId} = req.body;
      const email = req.body.email.toLowerCase();
      const user = await this.userService.getOneUserByEmailAndSchoolId(
        email,
        schoolId,
        true
      );

      if (!user) {
        res.status(400);
        res.json({message: userFriendlyMessage.failure.emailNotExist});
        return;
      }
      if (user.isTemporary) {
        res.status(400);
        res.json({message: userFriendlyMessage.failure.userIsTemporary});
        return;
      }

      const payload: Payload = {
        id: user.id,
      };
      const accessToken = JWTUtils.generateSetPasswordAccessToken(
        payload,
        user.password,
        {expiresIn: '30m'}
      );
      // TODO: Insert frontend url to set password.
      const url = `${enviroment.frontendUrl}/auth/setPassword?token=${accessToken}`;
      await this.emailService.sendResetForgotPasswordEmail(email, url);
      res.json({message: userFriendlyMessage.success.sendForgetPasswordEmail});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.sendEmail});
      next(e);
    }
  }
}
