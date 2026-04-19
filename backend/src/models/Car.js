const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Car = sequelize.define('Car', {
  make:             { type: DataTypes.STRING, allowNull: false },
  model:            { type: DataTypes.STRING, allowNull: false },
  variant:          { type: DataTypes.STRING },
  price_lakhs:      { type: DataTypes.FLOAT, allowNull: false },
  mileage_kmpl:     { type: DataTypes.FLOAT },
  fuel_type:        { type: DataTypes.STRING },   // petrol/diesel/cng/electric/hybrid
  seating_capacity: { type: DataTypes.INTEGER },
  safety_rating:    { type: DataTypes.FLOAT },    // out of 5
  segment:          { type: DataTypes.STRING },   // hatchback/sedan/suv/muv/ev/luxury
  use_case_tags:    { type: DataTypes.ARRAY(DataTypes.TEXT) }, // ['city','highway','family']
  description:      { type: DataTypes.TEXT },
}, {
  tableName: 'cars',
  underscored: true,
});

module.exports = Car;