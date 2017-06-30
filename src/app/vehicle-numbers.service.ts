import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class VehicleNumbersService {

  constructor(private http : Http ) { }

  getVehicleNumbers() : Observable<any[]> {

    var url = '/api/vehicleNumbers';

    return this.http.get(url).map(
      (res: Response) => {
        let data = res.json();
        return data;
      }
    )
    .catch((error : any) => {
      return Observable.throw( error.json().error || "Server Error")
    })
  }

}
