import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ExpenditureService } from '../expenditure.service';
import { default as swal } from 'sweetalert2';


import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'app-expenditure',
  templateUrl: './expenditure.component.html',
  styleUrls: ['./expenditure.component.css']
})
export class ExpenditureComponent implements OnInit {


  createExpenditureForm : any;
  expenditureCategories : any;
  expenditures : any;



  constructor(
    private fb : FormBuilder,
    private expenditureService : ExpenditureService
  ) {

      this.createExpenditureForm = fb.group({
        'expenditureCategoryId' : ["", Validators.required],
        'amount' : ["" , Validators.required],
        'comment' : ["", Validators.required ]
      })
   }

  ngOnInit() {


    this.getExpenditureCategories();
    this.getExpenditures();

  }

  getExpenditureCategories() {

    this.expenditureService.getExpenditureCategories().subscribe(
      expenditureCategories => {

        this.expenditureCategories = expenditureCategories;

      }
    )

  }

  createExpenditure() {

    var expenditureCategoryId = this.createExpenditureForm.value.expenditureCategoryId;

    var expenditureCategory = this.expenditureCategories.filter(
      function (obj) {
        return obj.id == expenditureCategoryId;
      }
    )[0];

    swal( {
      title : 'Create Expenditure ? ',
      text : 'Create expenditure of Rs' + this.createExpenditureForm.value.amount + ' for category ' + expenditureCategory.name,
      showCancelButton : true,
      preConfirm : () => {

        return this.expenditureService.createExpenditure(this.createExpenditureForm.value).map( response => {
          return response;
        })
        .toPromise()
        .catch ( err => {
          console.log("Error occurred");
          return err;
        })
      },
      allowOutsideClick : false
    })
    .then( ( response) => {


      var type : String;
      var title : String;
      if (response.expenditureCreated) {
        this.getExpenditures();
        this.createExpenditureForm.reset();
        swal({
          type : 'success',
          title : 'Rs' + String(response.expenditure.amount) + '  expenditure has been created'
        })
      }
      else {
        swal({
          type : 'error',
          title : 'Error creating expenditure'
        })
      }

    }, function (dismiss) {
      if ( dismiss == 'cancel') {
        return;
      }
    })
    .then ( () => {

    })
  }

  getExpenditures() {

    this.expenditureService.getExpenditures().subscribe(
      expenditures => {

        this.expenditures = expenditures;

      }
    )

  }





}
