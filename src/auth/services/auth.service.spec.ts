import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import createSpyObj = jasmine.createSpyObj;
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie';
import * as fromAuth from '../store';
import config from '../../../api/lib/config';
import { of } from 'rxjs';

const jwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOj`
    + `IwNTkyNTE3NDR9.3XJN4KnwY82gULXpN5tJDcUMmNcypk2MFPRUGB_Frv0`;


class CookieServiceMock {
    public get(name: string): string {
        return jwt;
    }
}

class StoreMock {
    pipe = jasmine.createSpy().and.returnValue(of(true));
    dispatch = jasmine.createSpy();
}

describe('AuthService', () => {
    let httpClient: HttpClient;
    let authService: AuthService;

    beforeEach(() => {

        httpClient = createSpyObj<HttpClient>('httpClient', ['get']);

        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: HttpClient, useValue: httpClient },
                { provide: CookieService, useClass: CookieServiceMock },
                { provide: Store, useClass: StoreMock },
            ]
        });

        authService = TestBed.get(AuthService);
    });

    it('should be created', () => {
        expect(authService).toBeTruthy();
    });

    xit('should return correct url', () => {
        const base = config.services.idam.idamLoginUrl;
        const clientId = config.services.idam.idamClientID;
        const url = authService.generateLoginUrl();
        expect(url).toContain(base);
        expect(url).toContain(clientId);
    });

    it('should return headers', () => {
        const headers = authService.getAuthHeaders();
        expect(headers).toEqual({ Authorization: jwt, __userid__: jwt });
    });

    it('should return authentication state', () => {
        const authentication = authService.isAuthenticated();
        expect(authentication).toEqual(true);
    });
});
