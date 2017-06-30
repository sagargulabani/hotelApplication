import { Component, OnInit } from '@angular/core';
import { VehicleNumbersService } from '../vehicle-numbers.service';


@Component({
  selector: 'app-vehicle-numbers',
  templateUrl: './vehicle-numbers.component.html',
  styleUrls: ['./vehicle-numbers.component.css']
})
export class VehicleNumbersComponent implements OnInit {

  constructor(private vehicleNumbersService : VehicleNumbersService ) { }

  vehicleNumbers: any;

  ngOnInit() {

    this.getVehicleNumbers();

  }

  getVehicleNumbers() {

    this.vehicleNumbersService.getVehicleNumbers().subscribe( vehicleNumbers => {
      this.vehicleNumbers = vehicleNumbers;
    })

  }


  printVehicleNumbers(): void {
      let printContents, popupWin;
      printContents = document.getElementById('vehicleNumberPrintSection').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();


      var string = '<div style = "text-align: center">'

      string += '<table style = "text-align: center" width = "100%">';
      string += '<tr>';
      string += '<th> Rooms </th>';
      string += '<th> Mobile </th>';
      string += '<th> Number </th>';
      string += '</tr>';

      for ( var i = 0; i < this.vehicleNumbers.length; i++ ) {
        var vehicleNumber = this.vehicleNumbers[i];
        string += '<tr>';
        string += '<td>';
        string += vehicleNumber.rooms;
        string += '</td>';
        string += '<td>';
        string += vehicleNumber.mobile;
        string += '</td>';
        string += '<td>';
        string += vehicleNumber.vehicleNumber;
        string += '</td>';
        string += '</tr>'
      }
      string += '</table>';
      string += '</div>';


      popupWin.document.write(`
         <html>
             <head>
                 <title>Print tab</title>
                 <style>
                 table {
                     width : 100%;
                     border: 1px solid black;
                     border-collapse : collapse;
                 }

                 th,td {
                   border: 1px solid black;
                   border-collapse : collapse;
                 }

                 </style>
             </head>
             <body onload="window.print();window.close()">${string}
             </body>
         </html>`
      );
      popupWin.document.close();
   }

}
