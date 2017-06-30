'use strict'

module.exports = (sequelize, DataTypes) => {

  const Guest = sequelize.define('guest' , {

    name : {
      type: DataTypes.STRING,
      allowNull: false
    },
    mobile : {
      type: DataTypes.STRING,
      allowNull: false
    },
    email : {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
  return Guest;
}
