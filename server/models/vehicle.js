'use strict'

module.exports = (sequelize, DataTypes) => {

  const Vehicle = sequelize.define('vehicle' , {

    number: {
      type : DataTypes.STRING,
    }

  });
  return Vehicle;
}
