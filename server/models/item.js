'use strict'

module.exports = (sequelize, DataTypes) => {

  const Item = sequelize.define('item' , {

    name : {
      type: DataTypes.STRING,
      allowNull: false
    },
    outsideRate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    insideRate : {
      type : DataTypes.STRING,
      allowNull : false
    },
    hindiName : {
      type : DataTypes.STRING
    }


  }, {
    charset : 'utf8',
    collate : 'utf8_unicode_ci'
  });
  return Item;
}
