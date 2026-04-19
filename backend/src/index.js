require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const Car = require('./models/Car');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({ status: 'CarAdvisor API running' }));

// One-hit seeder endpoint (for Railway — run once after deploy)
app.get('/api/seed', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    const { default: seed } = await import('./seed.js');
    res.json({ message: 'Seeded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api', require('./routes/recommend'));

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected');
    return sequelize.sync();
  })
  .then(() => app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`)))
  .catch(err => {
    console.error('❌ Startup failed:', err);
    process.exit(1);
  });