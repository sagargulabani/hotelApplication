/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CreateBookingService } from './create-booking.service';

describe('CreateBookingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateBookingService]
    });
  });

  it('should ...', inject([CreateBookingService], (service: CreateBookingService) => {
    expect(service).toBeTruthy();
  }));
});
