import express from 'express';

import TagController from '../controllers/TagController';
import Container from '../utils/container';

export default () => {
  const tagRouter = express.Router();
  const tagController: TagController =
    Container.getInstance().get('TagController');

  tagRouter.get('/', (_, res, next) => tagController.getAllTags(res, next));
  tagRouter.get('/:id', tagController.getOneTagById.bind(tagController));
  tagRouter.post('/', tagController.createOneTag.bind(tagController));
  tagRouter.put('/:id', tagController.updateOneTagById.bind(tagController));
  tagRouter.delete('/:id', tagController.deleteOneTagById.bind(tagController));

  return tagRouter;
};
