const createCrudService = require('./crudService');
const models = require('../models');

module.exports = Object.fromEntries(Object.entries(models).map(([name, Model]) => [name, createCrudService(Model, ['name', 'title', 'description', 'email'])]));
