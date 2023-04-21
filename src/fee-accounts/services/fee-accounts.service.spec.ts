import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { FeeAccountsService } from '.';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let feeAccountsService: FeeAccountsService;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let httpMock: HttpTestingController;

describe('FeeAccountsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        FeeAccountsService
      ]
    });

    feeAccountsService = TestBed.inject(FeeAccountsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([FeeAccountsService], (service: FeeAccountsService) => {
    expect(service).toBeTruthy();
  }));
});
