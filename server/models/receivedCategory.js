'use strict'

module.exports = (sequelize, DataTypes) => {

  const ReceivedCategory = sequelize.define('receivedCategory' , {

    name : {
      type : DataTypes.STRING,
      allowNull : false
    }
  });
  return ReceivedCategory;
}
