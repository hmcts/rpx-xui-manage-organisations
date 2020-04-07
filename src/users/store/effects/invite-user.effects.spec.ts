import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { LoggerService } from '../../../shared/services/logger.service';
import { InviteUserService } from '../../services/invite-user.service';
import { InviteUserFail, InviteUserSuccess, SendInviteUser } from '../actions/invite-user.actions';
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
            const action = new SendInviteUser(requestPayload);
            const completion = new InviteUserSuccess({ payload: 'something', userEmail: 'thecap@cave.com' });
            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: completion });
            expect(effects.saveUser$).toBeObservable(expected);
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
            const action = new SendInviteUser(requestPayload);
            const completion = new InviteUserFail(new Error());
            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: completion });
            expect(effects.saveUser$).toBeObservable(expected);
            expect(loggerService.error).toHaveBeenCalled();
        });
    });


});
