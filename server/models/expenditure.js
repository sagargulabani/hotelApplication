'use strict'

module.exports = (sequelize, DataTypes) => {

  const Expenditure = sequelize.define('expenditure' , {

    amount : {
      type : DataTypes.DECIMAL(8,2),
      allowNull : false
    },
    comment : {
      type : DataTypes.STRING
    }

  });

  return Expenditure;
}
