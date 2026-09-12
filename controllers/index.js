const services = require("../services");
const crudController = require("./crudController");

module.exports = Object.fromEntries(
  Object.entries(services).map(([name, service]) => [
    name,
    crudController(service, name),
  ]),
);
