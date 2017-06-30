import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class BookingService {

  constructor(private http: Http ) { }

  getBookingDetails(bookingId: number) {
    var getBookingDetailUrl = 'api/booking/' + bookingId;

    return this.http.get(getBookingDetailUrl).map(
      (res: Response) => {
        let data = res.json();
        return data;
      }
    )
  }

  receivePayment(data: Object ) {

    var receivePaymentUrl = 'api/receivePayment';

    let headers = new Headers({ 'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers : headers });
    let body = JSON.stringify(data);

    return this.http.post(receivePaymentUrl, body, options).map(
      (res:Response) => {
        let body = res.json();
        return body;
      }
    )
    .catch( (error: any) => {
      return Observable.throw(
        error.json().error || 'Server Error'
      );
    })
  }

  payback(data : Object) {

    var returnPaymentUrl =  'api/payback';

    let headers = new Headers( { 'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers : headers });
    let body = JSON.stringify(data);

    return this.http.post(returnPaymentUrl, body, options).map(
      (res: Response) => {
        let body = res.json();
        return body;
      }
    )
    .catch( (error: any) => {
      return Observable.throw(
        error.json().error || 'Server error'
      )
    })
  }

  checkout(data : Object ) {

    var checkoutUrl = 'api/checkout';

    let headers = new Headers({ 'Content-Type' : 'application/json '});
    let options = new RequestOptions({ headers : headers });
    let body = JSON.stringify(data);

    return this.http.post(checkoutUrl, body, options).map(
      (res: Response) => {
        let body = res.json();
        return body;
      }
    )
    .catch( (error: any) => {
      return Observable.throw(
        error.json().error || 'Server error'
      )
    })
  }

}
