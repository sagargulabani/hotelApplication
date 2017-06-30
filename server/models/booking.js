'use strict'

module.exports = (sequelize, DataTypes) => {

  const Booking = sequelize.define('booking' , {
    taxRate: {
      type: DataTypes.DECIMAL(5,3)
    },
    checkout : {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    checkinDate : {
      type : DataTypes.DATE,
      defaultValue : DataTypes.NOW
    },
    checkoutDate : {
      type : DataTypes.DATE
    },
    entryBookNo : {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    complementaryBreakfast : {
      type : DataTypes.BOOLEAN,
      defaultValue : false
    },
    extraBedCount : {
      type : DataTypes.INTEGER,
      defaultValue : 0
    }
  });
  return Booking;
}
