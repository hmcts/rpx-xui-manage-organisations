import { inject, TestBed } from '@angular/core/testing';
import { HeadersService } from './headers.service';
import { CookieService } from 'ngx-cookie';
import config from '../../api/lib/config';

const expiredJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOj`
    + `EwNTkyNTE3NDR9.6pdabSR59z99w-OE8_ZMka7IazJbY2cLfax09Cy1JIY`;

const nonExpiredJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHA`
    + `iOjIwNTkyNTE3NDR9.3XJN4KnwY82gULXpN5tJDcUMmNcypk2MFPRUGB_Frv0`;

const cookieService = {
    get: key => {
        return cookieService[key];
    },
    set: (key, value) => {
        cookieService[key] = value;
    },
    removeAll: () => { }
};

let deleteCookiesSpy;

describe('HeadersService', () => {
    beforeEach(() => {
        deleteCookiesSpy = spyOn(cookieService, 'removeAll');
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                HeadersService,
                { provide: CookieService, useValue: cookieService },
            ]
        });
    });

    it('should be created', inject([HeadersService], (service: HeadersService) => {
        expect(service).toBeTruthy();
    }));

    describe('isAuthenticated', () => {
        it('should return false when jwt is expired, true when still valid', inject([HeadersService], (service: HeadersService) => {
            cookieService.set('__auth__', null);
            expect(service.isAuthenticated()).toEqual(false);
            cookieService.set('__auth__', expiredJwt);
            expect(service.isAuthenticated()).toEqual(false);
            cookieService.set('__auth__', nonExpiredJwt);
            expect(service.isAuthenticated()).toEqual(true);
        }));

    });

    describe('getAuthHeaders', () => {
        it('should get headers', inject([HeadersService], (service: HeadersService) => {
            cookieService.set('__auth__', nonExpiredJwt);
            expect(service.getAuthHeaders()).toEqual({Authorization: nonExpiredJwt});
        }));
    });

});
