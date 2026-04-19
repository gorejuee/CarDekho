require('dotenv').config();
const sequelize = require('./config/database');
const Car = require('./models/Car');
const cars = require('./seed-data');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');
    await sequelize.sync({ force: true });
    await Car.bulkCreate(cars);
    console.log(`✅ ${cars.length} cars seeded`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();