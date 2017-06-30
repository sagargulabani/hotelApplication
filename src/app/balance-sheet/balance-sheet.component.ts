import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.css']
})

export class BalanceSheetComponent implements OnInit {


  reports: any;
  totalRoomRentWithTaxCollection : any;
  totalRoomServiceCollection: any;
  totalCollection: any;
  totalCashBalance : any;
  totalPending : any;
  totalCheckoutAmount : any;
  totalNonCheckoutAmount : any;
  totalAmountNotTaken : any;

  constructor(private reportService : ReportService) { }



  ngOnInit() {


    this.getRoomsReport();


  }

  getRoomsReport() {

    this.reportService.getRoomsReport().subscribe( response => {

      this.reports = response.reports;
      this.totalRoomRentWithTaxCollection = response.totalRoomRentWithTaxCollection;
      this.totalRoomServiceCollection = response.totalRoomServiceCollection;
      this.totalCollection = response.totalCollection;
      this.totalCashBalance = response.totalCashBalance;
      this.totalPending = response.totalPending;
      this.totalCheckoutAmount = response.totalCheckoutAmount;
      this.totalNonCheckoutAmount = response.totalNonCheckoutAmount
      this.totalAmountNotTaken = response.totalAmountNotTaken;

    });

  }

  print() : void {
    let printContents, popupWin;
  }



}
