import { HttpClient } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { AcceptTcService } from './accept-tc.service';
import { of } from 'rxjs';

describe('Accept Terms Service', () => {

    const httpClientMock = jasmine.createSpyObj<HttpClient>('HttpClient', ['get', 'post']);
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                AcceptTcService,
                { provide: HttpClient, useValue: httpClientMock }
            ]
        });
    });

    it('should be created', inject([AcceptTcService], (service: AcceptTcService) => {
        expect(service).toBeTruthy();
    }));

    it('should get from correct endpoint', inject([AcceptTcService], (service: AcceptTcService) => {
        httpClientMock.get.and.returnValue(of(null));
        service.getHasUserAccepted('test');
        expect(httpClientMock.get).toHaveBeenCalledWith('/api/userTermsAndConditions/test');
    }));

    it('should post to correct endpoint', inject([AcceptTcService], (service: AcceptTcService) => {
        httpClientMock.post.and.returnValue(of(null));
        service.acceptTandC('test');
        expect(httpClientMock.post).toHaveBeenCalledWith('/api/userTermsAndConditions', { userId: 'test' });
    }));

});
