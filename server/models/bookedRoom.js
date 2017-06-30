'use strict'

module.exports = (sequelize, DataTypes) => {

  const BookedRoom = sequelize.define('bookedRoom' , {
    id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true
    },
    rate : {
      type : DataTypes.DECIMAL(10,2),
      allowNull : false
    }

  });
  return BookedRoom;
}
