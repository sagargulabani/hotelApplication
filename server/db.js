const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'root', 'root' , {
  host: 'localhost',
  port: '3306',
  dialect: 'mysql'
});

sequelize.authenticate().then( function (err) {

  if (err) {
    console.log("There is connection in error");
  }
  else {
    console.log("Connection has been established");
  }

});


const db = {};

db.sequelize = sequelize;

db.BookedRoom = require('./models/bookedRoom')(sequelize,Sequelize);
db.Booking = require('./models/booking')(sequelize,Sequelize);
db.ExpenditureCategory = require('./models/expenditureCategory')(sequelize,Sequelize);
db.Guest = require('./models/guest')(sequelize,Sequelize);
db.Item = require('./models/item')(sequelize,Sequelize);
db.OrderBill = require('./models/orderBill')(sequelize,Sequelize);
db.OrderCategory = require('./models/orderCategory')(sequelize,Sequelize);
db.OrderItem = require('./models/orderItem')(sequelize,Sequelize);
db.Expenditure = require('./models/expenditure')(sequelize,Sequelize);

db.Received = require('./models/received')(sequelize,Sequelize);
db.Room = require('./models/room')(sequelize,Sequelize);
db.Vehicle = require('./models/vehicle')(sequelize,Sequelize);
db.Payback = require('./models/payback')(sequelize, Sequelize);
db.ClearAccount = require('./models/clearAccount')(sequelize, Sequelize);
db.ReceivedCategory = require('./models/receivedCategory')(sequelize, Sequelize);

db.Booking.hasMany(db.BookedRoom, { foreignKey : { allowNull : false}, onDelete : 'cascade'});

db.Guest.hasMany(db.Booking, { foreignKey : { allowNull : false}});

db.Booking.belongsTo(db.Guest, { foreignKey : { allowNull : false}});

db.Booking.hasMany(db.Received, { foreignKey : { allowNull : false}, onDelete : 'cascade'});

db.Booking.hasMany(db.Payback, { foreignKey : { allowNull : false}, onDelete : 'cascade'});

db.BookedRoom.hasMany(db.OrderBill, { foreignKey : { allowNull : false}, onDelete : 'cascade' });

db.OrderItem.belongsTo(db.OrderCategory);

db.OrderBill.hasMany(db.OrderItem, { foreignKey : { allowNull : false},  onDelete : 'cascade'});

db.OrderItem.belongsTo(db.Item, { foreignKey : { allowNull : false}});

db.Guest.hasMany(db.Vehicle , { foreignKey : { allowNull : false}, onDelete : 'cascade'});

 db.Expenditure.belongsTo( db.ExpenditureCategory , { foreignKey : { allowNull : false}});

db.BookedRoom.belongsTo( db.Room, { foreignKey : { allowNull : false}});

db.Room.belongsTo(db.Booking);

db.Received.belongsTo(db.Booking, { foreignKey : { allowNull : false}});





sequelize.sync({  }).then ( (err) => {
  if (err) {
    console.log(err);
  }
});


module.exports = db;
