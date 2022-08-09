import {NextFunction, Request, Response} from 'express';
import userFriendlyMessage from '../consts/userFriendlyMessages';
import UserService from '../services/UserService';
import {DeleteOptions} from '../services/UserService';

export default class UserController {
  private userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }
  async getSelf(req: Request, res: Response, next: NextFunction) {
    try {
      const {user} = req;
      res.json({message: userFriendlyMessage.success.getOneUser, data: user});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.getOneUser});
      next(e);
    }
  }

  async updateSelf(req: Request, res: Response, next: NextFunction) {
    try {
      const {user} = req;
      const id = user.id;
      const updatedAttributes = {...user, ...req.body};
      delete updatedAttributes['password'];
      const updatedUser = await this.userService.updateOneUserById(
        id,
        updatedAttributes
      );
      res.json({
        message: userFriendlyMessage.success.updateUser,
        data: updatedUser,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.updateUser});
      next(e);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user.schoolId;
      const users = (await this.userService.getAllUsers(schoolId)) || [];
      res.json({message: userFriendlyMessage.success.getAllUsers, data: users});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.getAllUsers});
      next(e);
    }
  }

  async getOneUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.getOneUserById(id);
      res.json({message: userFriendlyMessage.success.getOneUser, data: user});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.getOneUser});
      next(e);
    }
  }

  async updateOneUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const oldUser = await this.userService.getOneUserById(id);
      const updatedAttributes = {...oldUser, ...req.body};
      delete updatedAttributes['password'];
      const updatedUser = await this.userService.updateOneUserById(
        id,
        updatedAttributes
      );
      res.json({
        message: userFriendlyMessage.success.updateUser,
        data: updatedUser,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.updateUser});
      next(e);
    }
  }

  async deleteOneUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await this.userService.deleteOneUserById(id);
      res.json({message: userFriendlyMessage.success.deleteUser});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.deleteUser});
      next(e);
    }
  }

  async bulkDeleteUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const {id} = req.body;
      const deletionFilter: DeleteOptions = {id: id};
      await this.userService.bulkDeleteUser(deletionFilter);
      res.json({message: userFriendlyMessage.success.deleteUser});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.deleteUser});
      next(e);
    }
  }
}
