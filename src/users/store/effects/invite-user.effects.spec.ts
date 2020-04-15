import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { LoggerService } from '../../../shared/services/logger.service';
import { InviteUserService } from '../../services/invite-user.service';
import * as fromUsersActions from '../actions/invite-user.actions';
import * as fromUsersEffects from './invite-user.effects';

describe('Invite User Effects', () => {
    let actions$;
    let loggerService: LoggerService;
    let effects: fromUsersEffects.InviteUserEffects;
    const inviteUsersServiceMock = jasmine.createSpyObj('InviteUserService', [
        'inviteUser',
    ]);

    const mockedLoggerService = jasmine.createSpyObj('mockedLoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: InviteUserService,
                    useValue: inviteUsersServiceMock,
                },
                {
                    provide: LoggerService,
                    useValue: mockedLoggerService
                },
                fromUsersEffects.InviteUserEffects,
                provideMockActions(() => actions$)
            ]
        });

        effects = TestBed.get(fromUsersEffects.InviteUserEffects);
        loggerService = TestBed.get(LoggerService);
    });

    describe('saveUser$', () => {
        it('should return a collection from user details - InviteUserSuccess', () => {
            const payload = { payload: 'something' };
            inviteUsersServiceMock.inviteUser.and.returnValue(of(payload));
            const requestPayload = {
                firstName: 'Captain',
                lastName: 'Caveman',
                email: 'thecap@cave.com',
                permissions: ['god'],
                jurisdictions: [],
                isReinvite: false
            };
            const action = new fromUsersActions.SendInviteUser(requestPayload);
            const completion = new fromUsersActions.InviteUserSuccess({ payload: 'something', userEmail: 'thecap@cave.com' });
            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: completion });
            expect(effects.saveUser$).toBeObservable(expected);
        });
    });

    describe('getErrorAction', () => {
        it('should return 400 Action', () => {
            const error = {
                apiError: '',
                apiStatusCode: 400,
                message: ''
            };

            let action = fromUsersEffects.InviteUserEffects.getErrorAction(error);
            expect(action.type).toEqual(fromUsersActions.INVITE_USER_FAIL_WITH_400);

            error.apiStatusCode = 402;
            action = fromUsersEffects.InviteUserEffects.getErrorAction(error);
            expect(action.type).toEqual(fromUsersActions.INVITE_USER_FAIL_WITH_400);

            error.apiStatusCode = 403;
            action = fromUsersEffects.InviteUserEffects.getErrorAction(error);
            expect(action.type).toEqual(fromUsersActions.INVITE_USER_FAIL_WITH_400);

            error.apiStatusCode = 405;
            action = fromUsersEffects.InviteUserEffects.getErrorAction(error);
            expect(action.type).toEqual(fromUsersActions.INVITE_USER_FAIL_WITH_400);
        });

        it('should return 404 Action', () => {
            const error = {
                apiError: '',
                apiStatusCode: 404,
                message: ''
            };

            const action = fromUsersEffects.InviteUserEffects.getErrorAction(error);
            expect(action.type).toEqual(fromUsersActions.INVITE_USER_FAIL_WITH_404);
        });

        it('should return 429 Action', () => {
            const error = {
                apiError: '',
                apiStatusCode: 429,
                message: ''
            };

            const action = fromUsersEffects.InviteUserEffects.getErrorAction(error);
            expect(action.type).toEqual(fromUsersActions.INVITE_USER_FAIL_WITH_429);
        });

        it('should return 500 Action', () => {
            const error = {
                apiError: '',
                apiStatusCode: 500,
                message: ''
            };

            const action = fromUsersEffects.InviteUserEffects.getErrorAction(error);
            expect(action.type).toEqual(fromUsersActions.INVITE_USER_FAIL_WITH_500);
        });

        it('should return 409 Action', () => {
            const error = {
                apiError: '',
                apiStatusCode: 409,
                message: ''
            };

            const action = fromUsersEffects.InviteUserEffects.getErrorAction(error);
            expect(action.type).toEqual(fromUsersActions.INVITE_USER_FAIL);
        });
    });

    xdescribe('saveUser$ error', () => {
        it('should return InviteUserFail', () => {
            inviteUsersServiceMock.inviteUser.and.returnValue(throwError(new Error()));
            const requestPayload = {
                firstName: 'Captain',
                lastName: 'Caveman',
                email: 'thecap@cave.com',
                permissions: ['god'],
                jurisdictions: [],
                isReinvite: false
            };
            const action = new fromUsersActions.SendInviteUser(requestPayload);
            const completion = new fromUsersActions.InviteUserFail(new Error());
            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: completion });
            expect(effects.saveUser$).toBeObservable(expected);
            expect(loggerService.error).toHaveBeenCalled();
        });
    });


});
