import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RoomServiceService } from '../room-service.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { default as swal } from 'sweetalert2';


@Component({
  selector: 'app-create-room-service',
  templateUrl: './create-room-service.component.html',
  styleUrls: ['./create-room-service.component.css']
})
export class CreateRoomServiceComponent implements OnInit {

  form: FormGroup;
  filledRooms: Array<any> = [];
  items: Array<any> = [];
  orderCategories: Array<any> = [];
  quantity: Array<any> = [];


  constructor(
    private fb: FormBuilder,
    private roomServiceService : RoomServiceService,
    private router : Router
  ) {

    this.form = fb.group({
      'roomNumber': ['', Validators.required ],
      'items': fb.array([ this.initItem() ])
    })

  }

  getQuantity() {
    var quantity = [];
    for (var i = 1; i < 10; i ++ ) {
      quantity.push(i);
    }
    this.quantity = quantity
  }




  getFilledRooms() {
    this.roomServiceService.getFilledRooms().subscribe(filledRooms => {
      this.filledRooms = filledRooms;
    })
  }

  getItems(){
    this.roomServiceService.getItems().subscribe( items => {
      var array = [];
      for ( var i = 0; i < items.length; i++ ) {
        var item = items[i];
        array.push({ label : item.name , value : item.id })
      }
      this.items = array;
    });
  }

  getOrderCategories() {
    this.roomServiceService.getOrderCategories().subscribe( orderCategories => {
      this.orderCategories = orderCategories
    })
  }
  ngOnInit() {
    this.getFilledRooms();
    this.getItems();
    this.getOrderCategories();
    this.getQuantity();
  }

  initItem(){
    return this.fb.group({
      'itemId' : ["", Validators.required],
      'quantity' : ["", Validators.required],
      'orderCategoryId' : ["", Validators.required]
    })
  }

  addItem() {
    const control = <FormArray>this.form.controls['items']

    control.push(this.initItem());
  }


  removeItem(i : number ) {
    const control = <FormArray>this.form.controls['items'];
    control.removeAt(i);
  }

  placeOrder() {

    console.log(this.form.value);


    var roomNumber = this.form.value.roomNumber;


    var order = this.form.value.items;

    var orderHTML = '<h3>' + roomNumber + '</h3>';
    orderHTML += '<table class = "text-center" width = "100%">'


    for (var i = 0 ;i < order.length ; i++ ) {

      var itemId = order[i].itemId;
      var orderCategoryId = order[i].orderCategoryId;
      var quantity = order[i].quantity;


      var item = this.items.filter(function (obj) {
        return obj.value == itemId
      })[0];

      var orderCategory = this.orderCategories.filter(function (obj) {
        return obj.id == orderCategoryId
      })[0];

      console.log(item);
      orderHTML += '<tr>';
      orderHTML += '<td>' + item.label + '</td>';
      orderHTML += '<td>' + quantity + ' pcs '+ '</td>';
      orderHTML += '<td>' + orderCategory.name + '</td>';
      orderHTML += '</tr>';

    }

    orderHTML += '</table>'

    swal( {
      title : 'Confirm Order ?',
      html : orderHTML,
      type : 'question',
      showCancelButton : true,
      confirmButtonColor : '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Confirm!',
      preConfirm : () => {

        return this.roomServiceService.placeOrder(this.form.value).map(
          response => {
            return response;
          }
        )
        .toPromise()
        .catch( err => {
          console.log("Error occurred");
          return err;
        })
      },
      allowOutsideClick : false

    }).then ( (response) => {
      if (response.orderConfirmed == true) {
        swal({
          title : 'Order confirmed',
          text : 'the order has been confirmed',
          type : 'success',
          confirmButtonColor : '#3085d6',
          confirmButtonText : 'Order Completed'
        }).then ( () => {
          this.router.navigate(['/booking',response.bookingId])
        })
      }
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        return
      }
    });

  }





}
