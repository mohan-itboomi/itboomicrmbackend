const express = require('express');

const createResourceRouter = ({ controller, auth, admin }) => {
  const router = express.Router();
  router.get('/', auth, controller.list);
  router.get('/:id', auth, controller.get);
  router.post('/', auth, admin, controller.create);
  router.put('/:id', auth, admin, controller.update);
  router.delete('/:id', auth, admin, controller.remove);
  return router;
};

module.exports = createResourceRouter;
