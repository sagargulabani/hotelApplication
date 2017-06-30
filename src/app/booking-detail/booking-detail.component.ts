import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Location } from '@angular/common';
import { BookingService } from '../booking.service';
import { RoomsService } from '../rooms.service';
import { EmptyRoomsService } from '../empty-rooms.service';
import { default as swal } from 'sweetalert2';
import { Router } from '@angular/router';

import * as moment from 'moment';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css']
})
export class BookingDetailComponent implements OnInit {


  booking : any;
  guest : any;
  vehicles : any;
  receiveds : any;
  bookedRooms : any;
  orderBills : any;
  numberOfDays : any;
  noOfDays: number;
  roomTransferForm : FormGroup;
  receivePaymentForm : FormGroup;
  emptyRooms : any;
  paybacks : any;
  totalRoomRent : number;
  totalTax : number;
  totalRoomServicesBill : number;
  totalAmountPayback : number;
  totalAmountReceived: number;
  totalAmountPending: number;
  totalBillAmount: number;


  constructor(
    private route : ActivatedRoute,
    private location : Location,
    private bookingService : BookingService,
    private fb: FormBuilder,
    private roomsService : RoomsService,
    private emptyRoomsService : EmptyRoomsService,
    private router : Router
  ) {

    this.roomTransferForm = fb.group({
      'currentRoom' : ["", Validators.required],
      'newRoom' : ["", Validators.required],
      'bookingId' : ["", Validators.required]
    })

    }

  ngOnInit() {

    this.getAllInformation();
  }

  getAllInformation() {
    this.route.params.subscribe(params => {
      this.bookingService.getBookingDetails(+params['id'])
      .subscribe(booking => {
        this.booking = booking;
        this.guest = booking.guest;
        this.bookedRooms = booking.bookedRooms;
        this.vehicles = this.guest.vehicles;
        this.receiveds = booking.receiveds;
        this.orderBills = [];
        for ( var i = 0; i < booking.bookedRooms.length; i++ ) {
          var currentRoom = booking.bookedRooms[i].roomNumber;
          var orderBills = booking.bookedRooms[i].orderBills;
          for ( var j = 0; j < orderBills.length; j++) {
            var orderBill = orderBills[j];
            orderBill.room = currentRoom;
            this.orderBills.push(orderBill);
          }
        }
        this.paybacks = booking.paybacks;
        this.roomTransferForm.value.bookingId = booking.id;
        var bookingIdControl = <FormControl>this.roomTransferForm.controls['bookingId'];
        bookingIdControl.setValue(booking.id);
        this.getNumberOfDays();
        this.getEmptyRooms();
        this.totalRoomRent = 0;
        for ( var i = 0; i < this.bookedRooms.length; i++ ) {
          this.totalRoomRent += this.bookedRooms[i].rate;
        }

        this.totalRoomRent = this.totalRoomRent * this.noOfDays;

        this.totalTax = this.totalRoomRent * (this.booking.taxRate)/100;
        this.totalRoomServicesBill = 0;
        for (var i = 0; i < this.orderBills.length; i++ ) {
          var orderBill = this.orderBills[i];
            for ( var j = 0; j < orderBill.orderItems.length; j++ ) {
              var insideRate = orderBill.orderItems[j].item.insideRate;
              var qty = orderBill.orderItems[j].quantity;
              this.totalRoomServicesBill += insideRate * qty;
            }
        }

        this.totalAmountPayback = 0;
        for (var i = 0; i < this.paybacks.length; i++ ) {
          var amount = this.paybacks[i].amount;
          this.totalAmountPayback += amount;
        }

        this.totalAmountReceived = 0;
        for (var i = 0; i < this.receiveds.length; i++ ) {
          var amount = this.receiveds[i].amount;
          this.totalAmountReceived += amount;
        }

        this.totalBillAmount = (this.totalRoomRent + this.totalTax) + this.totalAmountPayback + this.totalRoomServicesBill

        this.totalAmountPending = this.totalBillAmount - this.totalAmountReceived;

      });
    })
  }

  getNumberOfDays() {

    var checkinDate = new Date(this.booking.checkinDate);

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

    console.log(consideredBeginDateInMoment);
    console.log(nowDate);

    var duration = moment.duration(nowDate.diff(consideredBeginDateInMoment));

    var durationInInt = duration.asDays();

    console.log(durationInInt);

    this.noOfDays = 1 + Math.floor(durationInInt);

  }

  getEmptyRooms() {
    this.emptyRoomsService.getEmptyRooms().subscribe(emptyRooms => {

      var array = [];
      for ( var i = 0; i < emptyRooms.length ; i++ ) {
        var room = emptyRooms[i];
        array.push({ label: String(room.number), value : String(room.number)});
      }
      this.emptyRooms = array;
    });

  }

  transferRoom() {

    swal( {
      title : 'Confirm Transfer ? ',
      text : 'Transfer room ' + String(this.roomTransferForm.value.currentRoom) + ' to ' + String(this.roomTransferForm.value.newRoom),
      type : 'question',
      showCancelButton : true,
      confirmButtonColor : '#3085d6',
      cancelButtonColor : '#d33',
      confirmButtonText : 'Yes, Confirm!'
    }).then( () => {

      this.roomsService.roomTransfer(this.roomTransferForm.value).subscribe(response => {
        if (response.roomTransferCompleted) {
          this.getEmptyRooms();
          this.getAllInformation();
          swal({
            title: 'Room Transfer Completed',
            text: "the room transfer has been completed",
            type: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Room Transfer Completed'
          }).then(() => {

          })
        }
      });

    }, function (dismiss) {
      if (dismiss == 'cancel') {
        return
      }
    });

  }

  paybackMoney() {
    swal({
      title: 'Enter amount',
      input: 'number',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      showLoaderOnConfirm: true,
      preConfirm: number => {

        console.log(this.booking);
        var data = {
          bookingId : this.booking.id,
          amount : number
        }
        return this.bookingService.payback(data).map(response => {
          return response
        })
        .toPromise()
        .catch( err => {
          console.log("Error occurred ");
          return err
        })
      },
      allowOutsideClick: false
    })
    .then((response) => {

      var type : String
      var title : String

      console.log(response);
      if (response.paybackCompleted) {
        this.getAllInformation()
        swal({
          type : 'success',
          title : 'Rs' + String(response.payback.amount) + ' has been returned'
        })
      }
      else {
        swal({
          type : 'error',
          title : 'Failure receiving payment'
        })

      }

    } , function (dismiss) {
      if (dismiss == 'cancel') {
        return;
      }
    })
    .then ( () => {
    })
  }

  receivePayment() {

    swal({
      title: 'Enter amount',
      input: 'number',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      showLoaderOnConfirm: true,
      preConfirm: number => {

        console.log(this.booking);
        var data = {
          bookingId : this.booking.id,
          amount : number
        }
        return this.bookingService.receivePayment(data).map(response => {
          return response
        })
        .toPromise()
        .catch( err => {
          console.log("Error occurred ");
          return err
        })
      },
      allowOutsideClick: false
    })
    .then((response) => {

      var type : String
      var title : String

      console.log(response);
      if (response.paymentReceived) {
        this.getAllInformation()
        swal({
          type : 'success',
          title : 'Rs' + String(response.received.amount) + ' has been received'
        })
      }
      else {
        swal({
          type : 'error',
          title : 'Failure receiving payment'
        })

      }

    } , function (dismiss) {
      if (dismiss == 'cancel') {
        return;
      }
    })
    .then ( () => {
    })
  }


  printRestaurantBillNumber(i) : void {

    let printContents, popupWin;

    let restaurantBill = this.orderBills[i];

    console.log(restaurantBill);
    var string = '<div style = "text-align: center">'

    string += '<h4>Room No: ' + restaurantBill.room + '</h4>';
    string += '<h5> Date : ' + moment(restaurantBill.createdAt).format('MMMM Do YYYY, h:mm:ss a') + '</h5>';
    string += '<table style = "text-align: center" width = "100%">';
    string += '<tr>';
    string += '<th> Item </th>';
    string += '<th> Qty </th>';
    string += '<th> From </th>';
    string += '</tr>';

    for ( var j = 0; j < restaurantBill.orderItems.length; j++ ) {
      var orderItem = restaurantBill.orderItems[j];
      string += '<tr>';
      string += '<td>';
      string += orderItem.item.name + ' ' + orderItem.item.hindiName;
      string += '</td>';
      string += '<td>';
      string += orderItem.quantity;
      string += '</td>';
      string += '<td>';
      string += orderItem.orderCategory.name;
      string += '</td>';
      string += '</tr>';
    }

    string += '</table>'
    string += '</div>'
    string += '<br>';
    string += '<br>';
    popupWin = window.open('', '_blank', 'top=0, left=0, height=100%, width=auto');
    popupWin.document.open();
    popupWin.document.write(`
        <html>
          <head>
            <title>Print Tab</title>
          </head>
          <style>
          </style>
          <body
          onload = "window.print();window.close(
          )">${string}
          </body>
        </html>`
      );

    popupWin.document.close();


  }

  checkout() {

    swal({
      type : 'question',
      title : 'Are you sure you want to checkout ?',
      text : 'Amount Pending is ' + this.totalAmountPending,
      showCancelButton : true,
      confirmButtonText : 'Checkout'
    })
    .then ( () => {
      var data = {
        bookingId : this.booking.id
      }

      this.bookingService.checkout(data).subscribe( response => {
        if ( response.checkoutCompleted) {
          swal({
            type : 'success',
            title : 'Checkout completed'
          })
          .then ( () => {
            this.router.navigate(['/current-rooms'])
          })
        }
        else {
          swal({
            type : 'error',
            title : 'Error checking out'
          })
        }
      })

    }, function (dismiss) {
      if ( dismiss == 'cancel') {
        return;
      }
    })

  }







}
