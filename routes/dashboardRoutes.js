const express = require('express');
const controller = require('../controllers/dashboardController');
module.exports = ({ auth }) => { const router = express.Router(); router.get('/summary', auth, controller.summary); return router; };