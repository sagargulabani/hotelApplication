/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RoomServiceService } from './room-service.service';

describe('RoomServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomServiceService]
    });
  });

  it('should ...', inject([RoomServiceService], (service: RoomServiceService) => {
    expect(service).toBeTruthy();
  }));
});
