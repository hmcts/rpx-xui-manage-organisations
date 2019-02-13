import { TestBed, inject } from '@angular/core/testing';

import { GovUiService } from './gov-ui.service';

describe('GovUiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GovUiService]
    });
  });

  it('should be created', inject([GovUiService], (service: GovUiService) => {
    expect(service).toBeTruthy();
  }));
});
