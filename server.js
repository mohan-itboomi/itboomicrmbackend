require('dotenv').config();
const { app } = require('./app');
const connectDatabase = require('./config/db');

connectDatabase()
  .then(() => app.listen(process.env.PORT || 5000, () => console.log('API running')))
  .catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  });
