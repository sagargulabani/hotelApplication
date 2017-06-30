'use strict'

module.exports = (sequelize, DataTypes) => {

  const OrderCategory = sequelize.define('orderCategory' , {
    name : {
      type: DataTypes.STRING,
      allowNull : false
    }
  });
  return OrderCategory;

}
