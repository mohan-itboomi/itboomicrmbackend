const service = require('../services/dashboardService');
const summary = async (req, res, next) => { try { res.json({ success: true, data: await service.summary(req.query.date) }); } catch (error) { next(error); } };
module.exports = { summary };