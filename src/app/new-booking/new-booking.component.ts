import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { EmptyRoomsService } from '../empty-rooms.service';
import { CreateBookingService } from '../create-booking.service';
import { default as swal } from 'sweetalert2'
import { Router } from '@angular/router';


@Component({
  selector: 'app-new-booking',
  templateUrl: './new-booking.component.html',
  styleUrls: ['./new-booking.component.css']
})
export class NewBookingComponent implements OnInit {

  form: FormGroup;
  numbers: Array<number> = [];
  options: Array<any> = [];
  totalAmount : number;



  constructor(private fb: FormBuilder, private emptyRoomsService : EmptyRoomsService, private createBookingService: CreateBookingService, private router : Router ) {


    this.form = fb.group({
      "guestName" : ["" , Validators.required ],
      "vehicleNumbers" : fb.array([ this.initVehicleNumber() ]),
      "mobileNumber" : [ "" , Validators.required],
      "rooms": ["", Validators.required ],
      "rate" : ['', Validators.required],
      "advance" : ["", Validators.required],
      "taxRate" : [9, Validators.required],
      "entryBookNo" : ["" , Validators.required]
    });

    this.totalAmount = ((this.form.value.rate * this.form.value.rooms.length) * (1 + (this.form.value.rate / 100 )))

    for (var i = 1; i < 10; i++ ) {
      this.numbers.push(i);
    }

  }

  initVehicleNumber() {
    return this.fb.group({
      'vehicleNumber' : ["", Validators.required ]
    });
  }

  addVehicleNumber() {

    const control = <FormArray>this.form.controls['vehicleNumbers'];
    control.push(this.initVehicleNumber());

  }

  removeVehicleNumber(i : number ) {

    const control = <FormArray>this.form.controls['vehicleNumbers'];
    control.removeAt(i);

  }

  onSubmit() {

    swal( {
      title : 'Confirm Booking ?',
      text : String(String(this.form.value.rooms.length) + 'rooms@' + this.form.value.rate +  ' per room'),
      type : 'question',
      showCancelButton : true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Confirm!',
      preConfirm : () => {
        return this.createBookingService.createBooking(this.form.value).map( response => {
          return response;
        })
        .toPromise()
        .catch( err => {
          console.log("Error occurred");
          return err;
        })
      },
      allowOutsideClick : false

    }).then ( (result) => {
      if (result.bookingConfirmed == true) {
        swal({
          title: 'Booking done',
          text: "the booking has been confirmed",
          type: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Booking Completed'
        }).then(() => {
          this.router.navigate(['/current-rooms'])
        })
      }
    }, function (dismiss) {

      if (dismiss === 'cancel') {
        return
      }
    });


  }


  ngOnInit() {
    this.getEmptyRooms();
  }

  getEmptyRooms() {
    this.emptyRoomsService.getEmptyRooms().subscribe(emptyRooms => {

      var array = [];
      for ( var i = 0; i < emptyRooms.length ; i++ ) {
        var room = emptyRooms[i];
        array.push({ label: String(room.number), value : String(room.number)});
      }
      this.options = array;
    });
  }

}
