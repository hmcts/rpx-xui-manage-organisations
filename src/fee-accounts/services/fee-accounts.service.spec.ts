import { TestBed, inject } from '@angular/core/testing';
import { FeeAccountsService } from '.';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

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

        feeAccountsService = TestBed.get(FeeAccountsService);
        httpMock = TestBed.get(HttpTestingController);

    });

    it('should be created', inject([FeeAccountsService], (service: FeeAccountsService) => {
        expect(service).toBeTruthy();
    }));
});
