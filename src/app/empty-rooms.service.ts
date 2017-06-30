import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Room } from './model/room';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class EmptyRoomsService {

  private emptyRoomsUrl = 'api/emptyRooms';

  constructor ( private http: Http ){}

  getEmptyRooms() : Observable<Room[]> {

    return this.http.get(this.emptyRoomsUrl).map(
      (res: Response) => {
        let body = res.json();
        console.log(body);
        return body;
      }
    )
    .catch((error : any ) => {
      return Observable.throw( error.json().error || 'Server error');
    });
  }

}
