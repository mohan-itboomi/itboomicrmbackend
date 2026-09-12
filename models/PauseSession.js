const mongoose = require('mongoose');
const schema = new mongoose.Schema({ workSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkSession', required: true }, taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true }, employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, startTime: { type: Date, required: true }, endTime: Date, durationMinutes: { type: Number, default: 0, min: 0 }, reason: String }, { timestamps: true });
module.exports = mongoose.models.PauseSession || mongoose.model('PauseSession', schema);
