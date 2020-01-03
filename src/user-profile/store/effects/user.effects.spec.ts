import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as fromUserEffects from './user.effects';
import { UserEffects } from './user.effects';
import { GetUserDetails, GetUserDetailsFailure, GetUserDetailsSuccess } from '../actions';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from 'src/shared/services/logger.service';

describe('Fee accounts Effects', () => {
    let actions$;
    let effects: UserEffects;
    const UserServiceMock = jasmine.createSpyObj('UserService', [
        'getUserDetails',
    ]);

    const LoggerServiceMock = jasmine.createSpyObj('LoggerService', ['log', 'error']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: UserService,
                    useValue: UserServiceMock,
                },
                {
                    provide: LoggerService,
                    useValue: LoggerServiceMock
                },
                fromUserEffects.UserEffects,
                provideMockActions(() => actions$)
            ]
        });

        effects = TestBed.get(UserEffects);

    });

    describe('getUser$', () => {
        it('should return a UserInterface - GetUserDetailsSuccess', () => {
            const returnValue = {
                userId: 'something',
                email: 'something',
                orgId: 'something',
                roles: []
            };
            UserServiceMock.getUserDetails.and.returnValue(of(returnValue));
            const action = new GetUserDetails();
            const completion = new GetUserDetailsSuccess(returnValue);
            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: completion });
            expect(effects.getUser$).toBeObservable(expected);
        });
    });

    describe('getUser$ error', () => {
        it('should return GetUserDetailsFailure', () => {
            UserServiceMock.getUserDetails.and.returnValue(throwError(new HttpErrorResponse({})));
            const action = new GetUserDetails();
            const completion = new GetUserDetailsFailure(new HttpErrorResponse({}));
            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: completion });
            expect(effects.getUser$).toBeObservable(expected);
        });
    });

});
