'use strict'

module.exports = (sequelize, DataTypes) => {

  const Payback = sequelize.define('payback' , {

    amount : {
      type : DataTypes.DECIMAL(10,2),
      allowNull : false
    }

  });
  return Payback;
}
