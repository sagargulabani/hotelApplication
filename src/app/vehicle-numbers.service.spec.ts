/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VehicleNumbersService } from './vehicle-numbers.service';

describe('VehicleNumbersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VehicleNumbersService]
    });
  });

  it('should ...', inject([VehicleNumbersService], (service: VehicleNumbersService) => {
    expect(service).toBeTruthy();
  }));
});
