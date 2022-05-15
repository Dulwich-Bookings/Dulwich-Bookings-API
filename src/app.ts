import express, {Application} from 'express';

import sequelize from './db';
import models from './models';

import TagController from './controllers/TagController';
import TagRepository from './repositories/TagRepository';
import TagRouter from './routes/TagRoutes';
import TagService from './services/TagService';

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
  }

  public async initContainer() {
    const container = Container.getInstance();
    container.register('db', sequelize, []);

    // repositories
    container.register('TagRepository', TagRepository, ['db']);

    // services
    container.register('TagService', TagService, ['TagRepository']);

    // controllers
    container.register('TagController', TagController, ['TagService']);

    // middlewares
  }

  public listen(port: string) {
    this.app.listen(port, () => {
      console.log(`⚡️[server]: Server is running on port ${port}`);
    });
  }
}
