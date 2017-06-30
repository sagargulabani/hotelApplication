import { Component, OnInit } from '@angular/core';
import { RoomsService } from '../rooms.service';
import { RouterModule, Routes } from '@angular/router';


@Component({
  selector: 'app-current-rooms',
  templateUrl: './current-rooms.component.html',
  styleUrls: ['./current-rooms.component.css']
})
export class CurrentRoomsComponent implements OnInit {

  groundFloor = { floor : 'ground' }
  firstFloor = { floor : 'first' }
  secondFloor = { floor : 'second' }
  thirdFloor = { floor : 'third' }
  floorArray = [this.groundFloor, this.firstFloor, this.secondFloor, this.thirdFloor ];

  rooms : Array<any> = [];
  roomsFilledCount: number = 0;

  constructor(private roomsService : RoomsService ) { }

  ngOnInit() {
    this.getRooms();
  }

  getRooms() {
    this.roomsService.getRooms().subscribe( rooms => {
      this.rooms = rooms;
      console.log(rooms);
      for (var i = 0 ; i < rooms.length; i++ ) {
        if (rooms[i].filled) {
          this.roomsFilledCount++;
        }
      }
    })
  }

  printVehicleNumbers(): void {
      let printContents, popupWin;
      printContents = document.getElementById('printSection').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
         <html>
             <head>
                 <title>Print tab</title>
                 <style>
                     //........Customized style.......
                 </style>
             </head>
             <body onload="window.print();window.close()">${printContents}
             </body>
         </html>`
      );
      popupWin.document.close();
   }

}
