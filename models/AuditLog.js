const mongoose = require('mongoose');
const schema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, action: { type: String, enum: ['CREATE', 'UPDATE', 'DELETE', 'ASSIGN', 'STATUS_CHANGE', 'TIMER_START', 'TIMER_PAUSE', 'TIMER_RESUME', 'TIMER_STOP', 'LOGIN', 'LOGOUT'], required: true }, module: { type: String, required: true }, entityId: mongoose.Schema.Types.ObjectId, oldValue: mongoose.Schema.Types.Mixed, newValue: mongoose.Schema.Types.Mixed, ipAddress: String, userAgent: String }, { timestamps: true });
schema.index({ module: 1, entityId: 1, createdAt: -1 });
module.exports = mongoose.models.AuditLog || mongoose.model('AuditLog', schema);
