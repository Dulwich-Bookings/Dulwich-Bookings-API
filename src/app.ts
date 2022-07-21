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
import AuthenticationMiddleware from './middlewares/authentication';

import ResourceController from './controllers/ResourceController';
import ResourceRepository from './repositories/ResourceRepository';
import ResourceRouter from './routes/ResourceRoutes';
import ResourceService from './services/ResourceService';

import SubscriptionController from './controllers/SubscriptionController';
import SubscriptionRepository from './repositories/SubscriptionRepository';
import SubscriptionRouter from './routes/SubscriptionRoutes';
import SubscriptionService from './services/SubscriptionService';

import SchoolController from './controllers/SchoolController';
import SchoolRepository from './repositories/SchoolRepository';
import SchoolRouter from './routes/SchoolRoutes';
import SchoolService from './services/SchoolService';

import BookmarkController from './controllers/BookmarkController';
import BookmarkRepository from './repositories/BookmarkRepository';
import BookmarkRouter from './routes/BookmarkRoutes';
import BookmarkService from './services/BookmarkService';

import RecentlyVisitedController from './controllers/RecentlyVisitedController';
import RecentlyVisitedRepository from './repositories/RecentlyVisitedRepository';
import RecentlyVisitedRouter from './routes/RecentlyVisitedRoutes';
import RecentlyVisitedService from './services/RecentlyVisitedService';

import TagMapController from './controllers/TagMapController';
import TagMapRepository from './repositories/TagMapRepository';
import TagMapRouter from './routes/TagMapRoutes';
import TagMapService from './services/TagMapService';

import ResourceMapController from './controllers/ResourceMapController';
import ResourceMapRepository from './repositories/ResourceMapRepository';
import ResourceMapRouter from './routes/ResourceMapRoutes';
import ResourceMapService from './services/ResourceMapService';

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

    Object.keys(models).forEach(key => {
      if ('associate' in models[key]) {
        models[key].associate(models);
      }
    });
  }

  public initControllers() {
    this.app.use('/tags', TagRouter());
    this.app.use('/users', UserRouter());
    this.app.use('/email', EmailRouter());
    this.app.use('/authentication', AuthenticationRouter());
    this.app.use('/resource', ResourceRouter());
    this.app.use('/subscription', SubscriptionRouter());
    this.app.use('/school', SchoolRouter());
    this.app.use('/bookmark', BookmarkRouter());
    this.app.use('/recentlyVisited', RecentlyVisitedRouter());
    this.app.use('/tagMap', TagMapRouter());
    this.app.use('/resourceMap', ResourceMapRouter());
  }

  public async initContainer() {
    const container = Container.getInstance();
    container.register('db', sequelize, []);

    // repositories
    container.register('TagRepository', TagRepository, ['db']);
    container.register('UserRepository', UserRepository, ['db']);
    container.register('ResourceRepository', ResourceRepository, ['db']);
    container.register('SubscriptionRepository', SubscriptionRepository, [
      'db',
    ]);
    container.register('SchoolRepository', SchoolRepository, ['db']);
    container.register('BookmarkRepository', BookmarkRepository, ['db']);
    container.register('RecentlyVisitedRepository', RecentlyVisitedRepository, [
      'db',
    ]);
    container.register('TagMapRepository', TagMapRepository, ['db']);
    container.register('ResourceMapRepository', ResourceMapRepository, ['db']);

    // services
    container.register('EmailService', EmailService, []);
    container.register('TagService', TagService, ['TagRepository']);
    container.register('UserService', UserService, ['UserRepository']);
    container.register('ResourceService', ResourceService, [
      'ResourceRepository',
    ]);
    container.register('SubscriptionService', SubscriptionService, [
      'SubscriptionRepository',
    ]);
    container.register('SchoolService', SchoolService, ['SchoolRepository']);
    container.register('BookmarkService', BookmarkService, [
      'BookmarkRepository',
    ]);
    container.register('RecentlyVisitedService', RecentlyVisitedService, [
      'RecentlyVisitedRepository',
    ]);
    container.register('TagMapService', TagMapService, ['TagMapRepository']);
    container.register('ResourceMapService', ResourceMapService, [
      'ResourceMapRepository',
    ]);

    // controllers
    container.register('EmailController', EmailController, ['EmailService']);
    container.register('TagController', TagController, ['TagService']);
    container.register('UserController', UserController, ['UserService']);
    container.register('AuthenticationController', AuthenticationController, [
      'UserService',
      'EmailService',
    ]);
    container.register('ResourceController', ResourceController, [
      'ResourceService',
      'TagMapService',
      'ResourceMapService',
    ]);
    container.register('SubscriptionController', SubscriptionController, [
      'SubscriptionService',
      'TagMapService',
      'ResourceMapService',
    ]);
    container.register('SchoolController', SchoolController, ['SchoolService']);
    container.register('BookmarkController', BookmarkController, [
      'BookmarkService',
    ]);
    container.register('RecentlyVisitedController', RecentlyVisitedController, [
      'RecentlyVisitedService',
    ]);
    container.register('TagMapController', TagMapController, ['TagMapService']);
    container.register('ResourceMapController', ResourceMapController, [
      'ResourceMapService',
    ]);

    // middlewares
    container.register('AuthenticationMiddleware', AuthenticationMiddleware, [
      'UserService',
    ]);
  }

  public listen(port: string) {
    this.app.listen(port, () => {
      console.log(`⚡️[server]: Server is running on port ${port}`);
    });
  }
}
