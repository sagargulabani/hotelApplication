'use strict'

module.exports = (sequelize, DataTypes) => {

  const OrderItem = sequelize.define('orderItem' , {
    quantity : {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cleared : {
      type : DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }

  });
  return OrderItem;
}
