/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EmptyRoomsService } from './empty-rooms.service';

describe('EmptyRoomsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmptyRoomsService]
    });
  });

  it('should ...', inject([EmptyRoomsService], (service: EmptyRoomsService) => {
    expect(service).toBeTruthy();
  }));
});
