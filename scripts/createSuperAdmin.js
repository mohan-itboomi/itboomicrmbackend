require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const email = process.env.SUPER_ADMIN_EMAIL || 'mohanapriyan1386@gmail.com';
const password = process.env.SUPER_ADMIN_PASSWORD || '12345678';

(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employee_tracker');
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.findOneAndUpdate(
    { email },
    { name: 'Super Admin', email, password: passwordHash, role: 'admin', status: 'Active', isDeleted: false },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );
  console.log(`Super Admin ready: ${user.email}`);
  await mongoose.disconnect();
})().catch(async (error) => {
  console.error('Unable to create Super Admin:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
