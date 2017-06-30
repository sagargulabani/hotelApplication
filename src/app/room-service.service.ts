import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class RoomServiceService {

  constructor(private http: Http ) { }

  getOrderCategories() {
    var getOrderCategoriesUrl = 'api/orderCategories';

    return this.http.get(getOrderCategoriesUrl).map(
      (res : Response) => {
        let data = res.json();
        return data;
      })
  }

  getFilledRooms() {
    var getFilledRoomsUrl = 'api/filledRooms';
    return this.http.get(getFilledRoomsUrl).map(
      (res: Response ) => {
        let data = res.json();
        return data;
      }
    )
  }

  getItems() {
    var getItemsUrl = 'api/items';
    return this.http.get(getItemsUrl).map(
      (res: Response ) => {
        let data = res.json();
        return data;
      }
    )
  }

  placeOrder(data: Object ) {


    var placeOrderUrl = '/api/placeOrder';
    let headers = new Headers({ 'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers : headers });
    let body = JSON.stringify(data);

    return this.http.post(placeOrderUrl, body, options).map(
      (res : Response ) => {
        let body = res.json();
        return body
      }
    )
    .catch( (error : any ) => {
      return Observable.throw( error.json().error || 'Server Error')
    });

  }

}
