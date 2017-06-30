'use strict'

module.exports = (sequelize, DataTypes) => {

  const ExpenditureCategory = sequelize.define('expenditureCategory' , {

    name : {
      type: DataTypes.STRING,
      allowNull: false
    },
    hindiName : {
      type : DataTypes.STRING
    }

  }, {
    charset : 'utf8',
    collate : 'utf8_unicode_ci'
  });
  return ExpenditureCategory;
}
