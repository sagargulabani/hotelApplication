import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class ReportService {

  constructor( private http : Http ) {


  }

  getRoomsReport() {
    var url = '/api/roomReport';

    return this.http.get(url).map(
      (res: Response ) => {
        let body = res.json();
        console.log(body);
        return body;
      }
    )
    .catch((error: any) => {
      return Observable.throw( error.json().error || 'Server error')
    });
  }


}
