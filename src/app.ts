import express, {Application} from 'express';

import sequelize from './db';
import models from './models';

import TagController from './controllers/TagController';
import TagRepository from './repositories/TagRepository';
import TagRouter from './routes/TagRoutes';
import TagService from './services/TagService';

import UserController from './controllers/UserController';
import UserRepository from './repositories/UserRepository';
import UserRouter from './routes/UserRoutes';
import UserService from './services/UserService';

import EmailController from './controllers/EmailController';
import EmailRouter from './routes/EmailRoutes';
import EmailService from './services/EmailService';

import AuthenticationController from './controllers/AuthenticationController';
import AuthenticationRouter from './routes/AuthenticationRoutes';

import uploadFile from './middlewares/uploadFile';
import parseCsv from './middlewares/parseCsv';

import Container from './utils/container';

export default class App {
  public app: Application;

  constructor() {
    this.app = express();
  }

  public initMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, DELETE'
      );
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, x-auth-token'
      );
      next();
    });
  }

  public initModels() {
    Object.keys(models).forEach(key => {
      models[key].initModel(Container.getInstance().get('db'));
    });
  }

  public initControllers() {
    this.app.use('/tags', TagRouter());
    this.app.use('/users', UserRouter());
    this.app.use('/email', EmailRouter());
    this.app.use('/authentication', AuthenticationRouter());
  }

  public async initContainer() {
    const container = Container.getInstance();
    container.register('db', sequelize, []);

    // repositories
    container.register('TagRepository', TagRepository, ['db']);
    container.register('UserRepository', UserRepository, ['db']);

    // services
    container.register('EmailService', EmailService, []);
    container.register('TagService', TagService, ['TagRepository']);
    container.register('UserService', UserService, ['UserRepository']);

    // controllers
    container.register('EmailController', EmailController, ['EmailService']);
    container.register('TagController', TagController, ['TagService']);
    container.register('UserController', UserController, ['UserService']);
    container.register('AuthenticationController', AuthenticationController, [
      'UserService',
      'EmailService',
    ]);

    // middlewares
    container.register('uploadFile', uploadFile, []);
    container.register('parseCsv', parseCsv, []);
  }

  public listen(port: string) {
    this.app.listen(port, () => {
      console.log(`⚡️[server]: Server is running on port ${port}`);
    });
  }
}
