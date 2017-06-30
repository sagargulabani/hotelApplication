import { Injectable } from '@angular/core';
import {  Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class CreateBookingService {

  private createBookingUrl = 'api/createBooking';

  constructor( private http: Http )  { }


  createBooking(data : Object) : Observable<any> {

    console.log(data);
    let headers = new Headers({'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers : headers });
    let body = JSON.stringify(data);

    return this.http.post(this.createBookingUrl, body , options ).map(
      (res: Response) => {
          let body = res.json();
          return body;
        }
      )
      .catch((error : any ) => {
        return Observable.throw( error.json().error || 'Server error');
      });

  }

}
