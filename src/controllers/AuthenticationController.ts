import {NextFunction, Request, Response} from 'express';
import {User} from '../models';
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
      const {email} = req.body;
      const user = await this.userService.getOneUserByEmail(email);

      if (user) {
        res.status(200).json({
          success: false,
          message: userFriendlyMessage.failure.emailExists,
        });
      }

      const payload = email;
      const accessToken = JWTUtils.generateAccessToken(payload);
      await this.userService.createOneUser(req.body);

      res.json({
        success: true,
        message: userFriendlyMessage.success.createUser,
        data: {
          accessToken,
        },
      });
    } catch (e) {
      res.status(400);
      res.json({
        success: false,
        message: userFriendlyMessage.failure.createUser,
      });
      next(e);
    }
  }

  async bulkSignUp(req: Request, res: Response, next: NextFunction) {}

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const {email, password} = req.body;
      const user = await User.scope('withPassword').findOne({where: {email}}); // Get user with password

      if (!user || !(await user.isPasswordMatch(password))) {
        res.status(401).json({
          success: false,
          message: userFriendlyMessage.failure.invalidSignInCredentials,
        });
      }

      const payload = email;
      const accessToken = JWTUtils.generateAccessToken(payload);

      res.status(200).json({
        success: true,
        message: userFriendlyMessage.success.signIn,
        data: {
          accessToken,
        },
      });
    } catch (e) {
      res.status(400);
      res.json({
        success: false,
        message: userFriendlyMessage.failure.signIn,
      });
      next(e);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {}

  async forgetPasswordEmail(req: Request, res: Response, next: NextFunction) {
    // When sending email containing link and access token, expiration parameter should be infinite
  }
}
