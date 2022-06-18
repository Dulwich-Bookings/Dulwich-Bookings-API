import {NextFunction, Request, Response} from 'express';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import {SchoolCreationAttributes} from '../models/School';
import SchoolService from '../services/SchoolService';

export default class SchoolController {
  private schoolService: SchoolService;
  constructor(schoolService: SchoolService) {
    this.schoolService = schoolService;
  }

  async createOneSchool(req: Request, res: Response, next: NextFunction) {
    try {
      const toCreate: SchoolCreationAttributes = {
        ...req.body,
      };
      const createdSchool = await this.schoolService.createOneSchool(toCreate);
      res.status(201);
      res.json({
        message: userFriendlyMessages.success.createSchool,
        data: createdSchool,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.createSchool});
      next(e);
    }
  }

  async getAllSchools(res: Response, next: NextFunction) {
    try {
      const schools = (await this.schoolService.getAllSchools()) || [];
      res.json({
        message: userFriendlyMessages.success.getAllSchools,
        data: schools,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getAllSchools});
      next(e);
    }
  }

  async getOneSchoolById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const school = await this.schoolService.getOneSchoolById(id);
      res.json({
        message: userFriendlyMessages.success.getOneSchool,
        data: school,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getOneSchool});
      next(e);
    }
  }

  async updateOneSchoolById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const oldSchool = await this.schoolService.getOneSchoolById(id);
      const updatedAttributes = {...oldSchool, ...req.body};
      const updatedSchool = await this.schoolService.updateOneSchoolById(
        id,
        updatedAttributes
      );
      res.json({
        message: userFriendlyMessages.success.updateSchool,
        data: updatedSchool,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.updateSchool});
      next(e);
    }
  }

  async deleteOneSchoolById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await this.schoolService.deleteOneSchoolById(id);
      res.json({message: userFriendlyMessages.success.deleteSchool});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.deleteSchool});
      next(e);
    }
  }
}
