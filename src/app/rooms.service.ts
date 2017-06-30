import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class RoomsService {

  private getRoomsUrl = 'api/rooms';


  constructor(private http: Http ) { }

  getRooms() : Observable<any[]> {

    return this.http.get(this.getRoomsUrl).map(
      (res: Response ) => {
        let data = res.json();
        return data;
      }
    )
    .catch((error : any ) => {
      return Observable.throw( error.json().error || 'Server error');
    })
  }

  getRoomDetails(id : number) {

    var getRoomDetailUrl = 'api/rooms/' + id;

    return this.http.get(getRoomDetailUrl).map(
      (res: Response) => {
        let data = res.json();
        return data;
      }
    )

  }

  roomTransfer(data : Object ) {

    var roomTransferUrl = '/api/roomTransfer';
    let headers = new Headers({ 'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers : headers });
    let body = JSON.stringify(data);

    return this.http.post(roomTransferUrl, body, options).map(
      (res:Response) => {
        let body = res.json();
        return body;
      }
    )
    .catch( (error: any) => {
      return Observable.throw(
        error.json().error || 'Server Error'
      )
    })
  }

}
