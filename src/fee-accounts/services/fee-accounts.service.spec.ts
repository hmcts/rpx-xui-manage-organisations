import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { FeeAccountsService } from '.';

let feeAccountsService: FeeAccountsService;
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
