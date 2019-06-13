import { TestBed, inject } from '@angular/core/testing';

import { HmctsFormBuilderService } from './hmcts-form-builder.service';

describe('HmctsFormBuilderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HmctsFormBuilderService]
    });
  });

  it('should be created', inject([HmctsFormBuilderService], (service: HmctsFormBuilderService) => {
    expect(service).toBeTruthy();
  }));
});
