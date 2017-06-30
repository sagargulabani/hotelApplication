const express = require('express');
const router = express.Router();
const db = require('../db.js');
const moment= require('moment');



router.get('/rooms', function (req,res) {

  db.Room.findAll({
    include : [
      {
        model: db.Booking,
        include : [
          { model : db.Guest },
          { model : db.BookedRoom }
         ]
      }
    ]
  }).then( rooms => {
    res.send(rooms);
  })

});



router.post('/rooms', function (req,res) {

  console.log(req.body);
  var room = req.body;

  db.Room.create(req.body).then( room => {

    return res.send(room);

  }).catch ( err => {
    console.log(err);
    res.status(400).send(err);
  });

});

router.get('/orderCategories', function (req,res) {

  db.OrderCategory.findAll({

  }).then ( orderCategories =>
    {
      return res.send(orderCategories)
    }
  )
  .catch ( err => {
    res.status(400).send(err);
  })
});

router.get('/items', function (req,res) {

  db.Item.findAll({

  }).then( items => {
    return res.send(items);
  })

});


router.post('/items', function (req,res) {



  var item = db.Item.build(req.body);

  item.save().then( item => {

    return res.send(item);

  }).catch( err => {

      console.log(err);
      return res.status(400).send(err);

  });

})

router.post('/orderCategories', function (req,res) {


  var name = req.body.name;

  var orderCategory = db.OrderCategory.build({
    name : name
  });

  orderCategory.save().then( orderCategory => {

    return res.send(orderCategory);

  }).catch( err => {

    console.log(err);
    return res.status(400).send(err);
  })

})


router.get('/booking/:bookingId', function (req,res) {

  var bookingId = req.params.bookingId;
  console.log(bookingId);

  db.Booking.findOne({
    where :
      {
        id : bookingId
      },
      include : [
        {
          model : db.Guest,
          include : [
            {
              model : db.Vehicle
            }
          ]
        },
        {
          model : db.BookedRoom,
          include : [
            {
              model : db.OrderBill,
              include : [
                {
                  model : db.OrderItem,
                  include : [
                    {
                      model : db.Item
                    },
                    {
                      model : db.OrderCategory
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          model : db.Received
        },
        {
          model : db.Payback
        }
      ]
  }).then(
    booking => {
      return res.send(booking);
    }
  )


});



router.get('/filledRooms', function (req,res) {
  db.Room.findAll({
    where : {
      filled : true
    }
  })
  .then ( filledRooms => {
    return res.send(filledRooms);
  })
  .catch ( err => {
    return res.status(400).send(err);
  })
});

router.get('/emptyRooms', function (req,res) {

  db.Room.findAll({
    where: {
      filled : false
    }
  }).then( rooms => {
    res.send(rooms);
  })
  .catch ( err => {
    res.status(400).send(err);
  });

});

router.post('/createBooking', function (req,res) {

  let booking = req.body;
  console.log(booking);

  var guestInstance = {
    name : req.body.guestName,
    mobile : req.body.mobileNumber,
    email : req.body.emailAddress
  };


  var bookingInstance = {
    taxRate : booking.taxRate,
    checkout : false,
    entryBookNo : booking.entryBookNo
  };

  var vehicleNumbersInstance = [];

  for ( var i = 0 ; i < req.body.vehicleNumbers.length; i++ ) {
    vehicleNumbersInstance.push (
      { number : req.body.vehicleNumbers[i].vehicleNumber }
    )
  }

  var receivedInstance = {
    amount : req.body.advance
  };


  var roomsInstance = [];


  for ( var i = 0 ; i < req.body.rooms.length ; i++) {
    var bookedRoom = { roomNumber : req.body.rooms[i], rate : req.body.rate};
    roomsInstance.push(bookedRoom);
  }


  function createGuest(guestInstance, t) {
    return db.Guest.create(guestInstance, { transaction : t});
  }

  function createBooking(guestInstance, bookingInstance, t) {
    bookingInstance.guestId = guestInstance.id;
    return db.Booking.create(bookingInstance, { transaction : t});
  }

  function createBookedRooms(roomsInstance, bookingInstance, t) {
    for ( var i = 0; i < roomsInstance.length ; i++ ) {
      roomsInstance[i].bookingId = bookingInstance.dataValues.id
    }
    console.log(roomsInstance)
    return db.BookedRoom.bulkCreate(roomsInstance, { transaction : t});
  }

  function createReceived(bookingInstance, receivedInstance , t) {
    receivedInstance.bookingId = bookingInstance.id;
    return db.Received.create(receivedInstance, { transaction : t});
  }




  function createVehicles(vehicleNumbersInstance, guestInstance, t) {
    for ( var   i = 0; i < vehicleNumbersInstance.length; i++ ) {
      vehicleNumbersInstance[i].guestId = guestInstance.dataValues.id;
    }
    return db.Vehicle.bulkCreate(vehicleNumbersInstance, { transaction : t});
  }

  function roomUpdate (bookingInstance, t) {
    return db.Room.update( {
      filled : true,
      bookingId : bookingInstance.id
    }, {
      where : {
        number : req.body.rooms
      },
      transaction : t
    })
  }



  db.sequelize.transaction( function (t) {


    return createGuest(guestInstance, t)
    .then ( function (guest) {
      guestInstance = guest;
      return createBooking(guestInstance, bookingInstance,t);
    })
    .then ( function (booking) {
      bookingInstance = booking;
      console.log("The booking instance is ");
      return createBookedRooms(roomsInstance, bookingInstance, t);
    })
    .then ( function () {
      return createReceived(bookingInstance, receivedInstance, t);
    })
    .then ( function () {
      return roomUpdate( bookingInstance, t);
    })
    .then ( function () {
      return createVehicles(vehicleNumbersInstance, guestInstance, t);
    })

  }).then ( function (result) {


    return res.send({bookingConfirmed : true });
  }).catch( function (err) {
    console.log(err);
    return res.status(400).send(err);
  });

});



router.post('/placeOrder', function (req,res) {


  console.log("Reached here");
  console.log(req.body);

  var roomNumber = req.body.roomNumber;
  var orderItemsInstance = req.body.items;

  var orderBillInstance;

  var roomInstance;

  var bookedRoomId;
  var bookingId;

  function getRoom(roomNumber, t) {
    return db.Room.findOne({
      where :
        {
          number : roomNumber
        },
        include : [
          {
            model : db.Booking,
            include : {
              model : db.BookedRoom,
              where : {
                roomNumber : roomNumber
              }
            }
          }
        ],
        transaction : t
    })
  }

  function getBookedRoomId(roomInstance) {

    console.log(roomInstance);
    bookedRoomId = roomInstance.booking.bookedRooms[0].id;
    bookingId = roomInstance.booking.id;

  }

  function createOrderBill(bookedRoomId, t) {

    console.log("Creating order bill")

    return db.OrderBill.create(
      {
        bookedRoomId : bookedRoomId
      }, {
        transaction : t
      }
    )
  }

  function createOrderItems(orderItemsInstance, orderBillInstance, t) {

    for ( var i = 0; i < orderItemsInstance.length; i++ ) {
      orderItemsInstance[i].orderBillId = orderBillInstance.id;
    }

    console.log(orderItemsInstance);

    return db.OrderItem.bulkCreate(orderItemsInstance, {
      transaction : t
    });

  }

  db.sequelize.transaction( function (t) {

    return getRoom(roomNumber, t)
    .then(
      function ( roomInstance ) {
        roomInstance = roomInstance;
        getBookedRoomId(roomInstance);
        return createOrderBill(bookedRoomId, t);
      }
    )
    .then (
      function (orderBill) {
        orderBillInstance = orderBill;

        return createOrderItems(orderItemsInstance, orderBillInstance, t)

      }
    )
  }).then ( function (result) {

    return res.send({ orderConfirmed : true, bookingId : bookingId})
  }).catch( function (err) {
    console.log(err);
    return res.status(400).send(err);
  })



})

router.post('/roomTransfer' , function (req,res) {

  var currentRoom = req.body.currentRoom;
  var newRoom = req.body.newRoom;
  var bookingId = req.body.bookingId;

  function updateOldRoom(t) {

    return db.Room.update({
      filled : false,
      bookingId : null
    }, {
      where :
        {
          bookingId : bookingId,
          number : currentRoom
        },
        transaction : t
    })
  }

  function updateNewRoom(t) {
    return db.Room.update({
      filled : true,
      bookingId : bookingId
    }, {
      where :
        {
          number : newRoom
        },
        transaction : t
    })
  }

  function updateBookedRoom(t) {
    return db.BookedRoom.update({
      roomNumber : newRoom
    }, {
      where :
        {
          roomNumber : currentRoom,
          bookingId : bookingId
        },
        transaction : t
    }
  )
  }

  db.sequelize.transaction( function (t) {

    return updateOldRoom(t)
    .then( function (oldRoomInstance) {
      console.log(oldRoomInstance);

      return updateNewRoom(t)

    })
    .then( function (newRoomInstance) {
      console.log(newRoomInstance);
      return updateBookedRoom(t);
    })
  })
  .then ( function (result) {

    return res.send({ roomTransferCompleted : true, bookingId : bookingId })
  })
  .catch( function (err) {
    console.log(err);
    return res.status(400).send(err)
  })

});


router.post('/receivePayment' , function (req,res) {

  var amount = req.body.amount;
  var bookingId = req.body.bookingId;

  db.Received.create(req.body).then(
    function (receivedInstance) {
      return res.send({ paymentReceived : true, received : receivedInstance });
    }
  )
  .catch( function (err) {
    console.log(err);
    return res.status(400).send(err)
  })

})

router.post('/checkout', function (req,res) {

  var bookingId = req.body.bookingId;

  function updateBooking(bookingId, t) {
    return db.Booking.update({
      checkout: true,
      checkoutDate : new Date(),
    }, {
      where : {
        id : req.body.bookingId
      },
      transaction : t
    });
  }


  function updateRooms(bookingId, t) {
    return db.Room.update({
      filled : false
    }, {
      where : {
        bookingId : bookingId
      },
      transaction : t
    })
  }

  db.sequelize.transaction( function(t) {

    return updateBooking(bookingId, t)
    .then ( function (bookingInstance) {
      return updateRooms(bookingId, t)
    })

  })
  .then ( function (result) {
    return res.send({
       checkoutCompleted : true , bookingId : bookingId
    });
  })
  .catch( function (err) {
    console.log(err);
    return res.status(400).send(err);
  })
});




router.get('/expenditureCategory', function (req,res) {

  db.ExpenditureCategory.findAll({

  })
  .then ( response => {
    return res.send(response);
  })
  .catch (err => {
    console.log(err);
    return res.status(400).send(err);
  })
});

router.post('/expenditureCategory', function (req,res) {



  db.ExpenditureCategory.create(req.body)
  .then ( expenditureCategory => {
    res.send(expenditureCategory)
  })
  .catch( err => {
    console.log(err);
    res.status(400).send(err);
  })

})


router.post('/expenditure' , function (req,res) {

  var amount = req.body.amount;
  var expenditureCategoryId = req.body.expenditureCategoryId;

  db.Expenditure.create(req.body)
  .then ( function (expenditure) {
    return res.send({expenditureCreated: true, expenditure: expenditure });
  })
  .catch ( function (err) {
    return res.status(400).send(err);
  });
})

router.post('/payback', function (req,res) {

  var amount = req.body.amount;
  var bookingId = req.body.bookingId;


  db.Payback.create(req.body)
  .then ( response => {

    return res.send({paybackCompleted : true, payback : response });

  })
  .catch (err => {
    console.log(err);
    return res.status(400).send(err);
  });


});

router.get('/expenditure', function (req,res) {

  db.Expenditure.findAll({
    include : [
      {
        model : db.ExpenditureCategory
      }
    ],
    order : [
      ['createdAt', 'DESC']
    ]
  })
  .then(
    response => {
      return res.send(response);
    }
  )
  .catch(
    err => {
      return res.status(400).send(err);
    }
  )
});

router.delete('/booking/:id', function (req,res) {

  var bookingId = req.params.id;

  db.Booking.findById(bookingId)
  .then (
    booking => {
      return booking.destroy();
    }
  ).then ( () => {
    return res.send({bookingDeleted : true})
  })
  .catch (err => {
    return res.status(400).send(err);
  })

});


router.post('/clearBookings', function (req,res) {

})

router.get('/roomReport' , function (req,res) {

  db.Booking.findAll({
    include : [
      {
        model : db.BookedRoom,
        include : [
          {
            model : db.OrderBill,
            include : [
              {
                model : db.OrderItem,
                include : [
                  {
                    model : db.Item
                  },
                  {
                    model : db.OrderCategory
                  }
                ]
              },
            ]
          }
        ]
      },
      {
        model : db.Received
      },
      {
        model : db.Payback
      }
    ]
  })
  .then ( bookings => {

    console.log(bookings);

    var reports = [];

    var response = {};
    response.totalRoomRentWithTaxCollection = 0;
    response.totalRoomServiceCollection = 0;
    response.totalCollection = 0;
    response.totalCashBalance = 0;
    response.totalPending = 0;
    response.totalCheckoutAmount = 0;
    response.totalNonCheckoutAmount = 0;
    response.totalAmountNotTaken = 0;

    for ( var i = 0; i < bookings.length ; i++ ) {



      var booking = bookings[i];
      var roomReport = {};
      roomReport.checkout = booking.checkout;
      roomReport.totalRoomRent = 0;
      roomReport.numberOfDays = getNumberOfDays(booking.checkinDate, booking );
      roomReport.roomNumber = "";
      roomReport.totalRoomServicesBill = 0;

      for (var j = 0 ; j < booking.bookedRooms.length; j++ ) {
        var bookedRoom = booking.bookedRooms[j];
        roomReport.roomNumber += String(bookedRoom.roomNumber);


        roomReport.totalRoomRent += bookedRoom.rate;
        for (var k = 0; k < bookedRoom.orderBills.length; k++ ) {
          var orderBill = bookedRoom.orderBills[k];
          for ( var l = 0; l < orderBill.orderItems.length; l++ ) {
            var orderItem = orderBill.orderItems[l];
            var totalRate = orderItem.item.insideRate * orderItem.quantity;
            roomReport.totalRoomServicesBill += totalRate;
          }
        }
      }


      roomReport.totalTax = roomReport.totalRoomRent * booking.taxRate / 100;
      roomReport.totalRoomAmountWithTax = (roomReport.totalRoomRent + roomReport.totalTax) * roomReport.numberOfDays;

      roomReport.totalBillAmount = roomReport.totalRoomAmountWithTax + roomReport.totalRoomServicesBill;



      roomReport.totalAmountReceived = 0;
      for ( var j =0 ; j < booking.receiveds.length; j++) {
        var received = booking.receiveds[j];
        roomReport.totalAmountReceived += received.amount;
      }


      roomReport.totalAmountPayback = 0;
      for ( var j = 0; j < booking.paybacks.length; j++ ) {
        var payback = booking.paybacks[j];
        roomReport.totalAmountPayback += payback.amount;
      }


      roomReport.totalReceived = roomReport.totalAmountReceived - roomReport.totalAmountPayback;


      roomReport.totalPending = roomReport.totalBillAmount - roomReport.totalReceived;






      if (roomReport.checkout) {
        response.totalCheckoutAmount += roomReport.totalBillAmount;
        roomReport.totalAmountNotTaken = roomReport.totalPending;
        delete roomReport.totalPending;
      }
      else {
        response.totalNonCheckoutAmount += roomReport.totalBillAmount;
      }

      response.totalRoomServiceCollection += roomReport.totalRoomServicesBill;
      response.totalRoomRentWithTaxCollection += roomReport.totalRoomAmountWithTax;
      response.totalCollection += roomReport.totalBillAmount;

      if (roomReport.totalPending) {
        response.totalPending += roomReport.totalPending;
      }

      if (roomReport.totalAmountNotTaken) {
        response.totalAmountNotTaken += roomReport.totalAmountNotTaken;
      }

      response.totalCashBalance += roomReport.totalReceived;

      reports.push(roomReport);

    }


    response.reports = reports;

    return res.send(response);

  })

  function getNumberOfDays(checkinDate, booking) {

    var checkinDate = new Date(checkinDate);

    var consideredBeginDate =  checkinDate;

    console.log(checkinDate);


    var hourOfTheDay = checkinDate.getHours();

    if (hourOfTheDay < 5 ) {
      consideredBeginDate.setDate(checkinDate.getDate() - 1);
    }

    consideredBeginDate.setHours(12);
    consideredBeginDate.setMinutes(0);
    consideredBeginDate.setSeconds(0);



    var consideredBeginDateInMoment = moment(consideredBeginDate);

    var nowDate = moment(new Date());

    if (booking.checkout) {
      nowDate = moment(booking.checkoutDate);
    }

    console.log(consideredBeginDateInMoment);
    console.log(nowDate);

    var duration = moment.duration(nowDate.diff(consideredBeginDateInMoment));

    var durationInInt = duration.asDays();

    console.log(durationInInt);

    var noOfDays = 1 + Math.floor(durationInInt);
    return noOfDays;

  }



});




router.get('/balance-sheet', function (req,res) {


  var lastClearBalanceDate;
  var bookings;
  var expenditures;


  function getLastClearBalanceCreationDate() {

    return db.ClearAccount.max('createdAt')

  }


  function getBookings(lastClearBalanceDate, t) {

    return db.Booking.findAll({
      where : {
        checkoutDate : {
          $gt : lastClearBalanceDate
        }
      },
      include : [
        {
          model : db.Received,
          include : [
            {
              model : db.BookedRoom,
              include : [
                {
                  model : db.OrderBill,
                  include : [
                    {
                      model : db.OrderItem,
                      include : [
                        {
                          model : db.Item
                        },
                        {
                          model : db.Category
                        }
                      ]
                    }
                  ]
                }
              ]

            }
          ]
        }
      ],
      transaction : t
    })
  }

  function getExpenditures(t) {
    db.Expenditure.findAll({
      include : [
        {
          model : db.ExpenditureCategory
        }
      ],
      transaction : t
    })
  }

  sequelize.transaction( function (t) {

    return getLastClearBalanceCreationDate()
    .then(
      function (lastClearBalanceDate) {
        if (!lastClearBalanceDate) {
          lastClearBalanceDate = new Date(0);
        }
        console.log(lastClearBalanceDate);
        return getBookings(lastClearBalanceDate, t)
      }
    )

  }).
  then ( function (bookings) {
    bookings = bookings;

    return getExpenditures(t);
  })

})

router.get('/vehicleNumbers', function (req,res) {

  db.Booking.findAll({
    where : {
      checkout : false
    },
    include : [
      {
        model: db.Guest,
        include : [
          {
            model : db.Vehicle
          }
        ]
      },
      {
        model : db.BookedRoom
      }
    ]
  })
  .then ( bookings => {

    var response = [];

    for ( var i = 0; i < bookings.length; i++ ) {

      var booking = bookings[i];
      var guest = booking.guest;

      var vehicleNumbers = guest.vehicles;

      var rooms = "";

      var bookedRooms = booking.bookedRooms;

      for (var j = 0; j < bookedRooms.length; j++ ) {

        var bookedRoom = bookedRooms[j];

        var roomNumber = bookedRoom.roomNumber;

        rooms += roomNumber + " ";

      }

      for ( var j = 0; j < vehicleNumbers.length; j++ ) {

        var vehicleNumber = vehicleNumbers[j];

        var doc = {};
        doc.rooms = rooms;
        doc.mobile = guest.mobile;
        doc.vehicleNumber = vehicleNumber.number;
        response.push(doc);
      }

    }

    return res.send(response);

  })
})





module.exports = router;
