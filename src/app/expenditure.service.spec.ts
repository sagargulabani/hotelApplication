/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExpenditureService } from './expenditure.service';

describe('ExpenditureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenditureService]
    });
  });

  it('should ...', inject([ExpenditureService], (service: ExpenditureService) => {
    expect(service).toBeTruthy();
  }));
});
