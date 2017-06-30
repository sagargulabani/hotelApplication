import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {


  showSidebar: boolean;

  constructor() { }

  ngOnInit() {
    this.showSidebar = false;
  }

  toggleButtonClicked() {
    this.showSidebar = !this.showSidebar;
  }

}
