'use strict'

module.exports = (sequelize, DataTypes) => {

  const Room = sequelize.define('room' , {

    number : {
      type : DataTypes.INTEGER,
      primaryKey: true
    },
    filled : {
      type : DataTypes.BOOLEAN,
      defaultValue: false
    },
    floor : {
      type : DataTypes.ENUM('ground', 'first', 'second', 'third')
    }

  });
  return Room;
}
