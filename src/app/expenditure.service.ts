import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ExpenditureService {

  constructor(private http:Http ) { }


  getExpenditureCategories() {
    var getExpenditureCategoriesUrl = 'api/expenditureCategory';

    return this.http.get(getExpenditureCategoriesUrl).map(
      (res: Response ) => {
        let data = res.json();
        return data;
      }
    )
  }

  createExpenditure(data : Object) {
    var createExpenditureUrl = 'api/expenditure';
    let headers = new Headers({ 'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers : headers });
    let body = JSON.stringify(data);

    return this.http.post(createExpenditureUrl, body, options).map(
      (res: Response ) => {
        let body = res.json();
        return body;
      }
    )
    .catch( (error : any) => {
      return Observable.throw( error.json().error || 'Server error')
    })
  }

  getExpenditures() {
    var getExpendituresUrl = 'api/expenditure';

    return this.http.get(getExpendituresUrl).map(
      (res: Response ) => {
        let data = res.json();
        return data;
      }
    )
    .catch( (error: any) => {
      return Observable.throw( error.json().error || 'Server error');
    })
  }

}
