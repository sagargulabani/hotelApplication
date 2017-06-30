'use strict'

module.exports = (sequelize, DataTypes) => {

  const Received = sequelize.define('received' , {

    amount : {
      type : DataTypes.DECIMAL(10,2),
      allowNull : false
    },
    method : {
      type : DataTypes.ENUM('bank','paytm','cash')
    }
  });
  return Received;
}
