import { TestBed, inject } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/user-profile.service';

const AuthServiceMock = {
    auth: false,
    isAuthenticated: () => {
        return AuthServiceMock.auth;
    },
    setAuth: key => {
        return AuthServiceMock.auth = key;
    },
    loginRedirect: () => {
        return true;
    }
};

describe('AuthGuard', () => {

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [],
            providers: [
                AuthGuard,
                { provide: AuthService, useValue: AuthServiceMock },
            ]
        });
    });

    it('should be created', inject([AuthGuard], (service: AuthGuard) => {
        expect(service).toBeTruthy();
    }));

    describe('canActivate', () => {
        it('should return false if not authenticated', inject([AuthGuard], (service: AuthGuard) => {
            AuthServiceMock.setAuth(false);
            expect(service.canActivate()).toEqual(false);
        }));

        it('should return true if authenticated', inject([AuthGuard], (service: AuthGuard) => {
            AuthServiceMock.setAuth(true);
            expect(service.canActivate()).toEqual(true);
        }));

    });

});
