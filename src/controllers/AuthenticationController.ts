import {NextFunction, Request, Response} from 'express';
import userFriendlyMessage from '../consts/userFriendlyMessages';
import UserService from '../services/UserService';
import JWTUtils from '../utils/jwtUtils';

export default class AuthenticationController {
  private userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const {email, password, passwordConfirmation} = req.body;
      const user = await this.userService.getOneUserByEmail(email);

      if (user) {
        res.status(400).send({
          message: userFriendlyMessage.failure.emailExists,
        });
        return;
      }
      if (password !== passwordConfirmation) {
        res.status(400).json({
          message: userFriendlyMessage.failure.passwordConfirmationMismatch,
        });
      }

      const payload = email;
      const accessToken = JWTUtils.generateAccessToken(payload);
      await this.userService.createOneUser({...req.body});

      res.json({
        message: userFriendlyMessage.success.createUser,
        data: {
          accessToken,
        },
      });
    } catch (e) {
      res.status(400);
      res.json({
        message: userFriendlyMessage.failure.createUser,
      });
      next(e);
    }
  }

  async bulkSignUp(req: Request, res: Response, next: NextFunction) {}

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const {email, password} = req.body;
      const user = await this.userService.getOneUserByEmail(email, true);

      if (!user) {
        res.status(401).send({
          message: userFriendlyMessage.failure.userNotExist,
        });
        return;
      }
      if (!user.isPasswordMatch(password)) {
        res.status(401).send({
          message: userFriendlyMessage.failure.incorrectPassword,
        });
        return;
      }

      const payload = email;
      const accessToken = JWTUtils.generateAccessToken(payload);

      res.json({
        success: true,
        message: userFriendlyMessage.success.signIn,
        data: {
          accessToken,
        },
      });
    } catch (e) {
      res.status(400);
      res.json({
        message: userFriendlyMessage.failure.signIn,
      });
      next(e);
    }
  }

  async setPassword(req: Request, res: Response, next: NextFunction) {
    // try {
    // } catch (e) {}
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      //TODO: Auth Middleware will add the current user in req.user
      const {user} = req;
      const {originalPassword, newPassword, newPasswordConfirmation} = req.body;

      if (!user) {
        res
          .status(400)
          .send({message: userFriendlyMessage.failure.userNotExist});
        return;
      }
      if (!(await user.isPasswordMatch(originalPassword))) {
        res
          .status(401)
          .send({message: userFriendlyMessage.failure.incorrectPassword});
        return;
      }
      if (newPassword !== newPasswordConfirmation) {
        res.status(400).send({
          message: userFriendlyMessage.failure.passwordConfirmationMismatch,
        });
        return;
      }

      const id = user.id;
      const updatedAttributes = {...user, ...req.body};
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
    // try {
    //   const payload = 'test';
    //   const accessToken = JWTUtils.generateAccessToken(payload, {});
    // } catch (e) {}
  }
}
