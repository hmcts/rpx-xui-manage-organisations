import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as fromUsersEffects from './invite-user.effects';
import { InviteUserEffects } from './invite-user.effects';
import { SendInviteUser, InviteUserSuccess, InviteUserFail } from '../actions/invite-user.actions';
import { InviteUserService } from '../../services/invite-user.service';
import { JurisdictionService } from 'src/users/services';
import { LoggerService } from 'src/shared/services/logger.service';

describe('Invite User Effects', () => {
    let actions$;
    let effects: InviteUserEffects;

    const InviteUsersServiceMock = jasmine.createSpyObj('InviteUserService', [
        'inviteUser',
    ]);
    const mockedLoggerService = jasmine.createSpyObj('mockedLoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);

    const mockJurisdictionService = jasmine.createSpyObj('mockJurisdictionService', ['getJurisdictions']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: InviteUserService,
                    useValue: InviteUsersServiceMock,
                },
                {
                    provide: JurisdictionService,
                    useValue: mockJurisdictionService
                },
                {
                    provide: LoggerService,
                    useValue: mockedLoggerService
                },
                fromUsersEffects.InviteUserEffects,
                provideMockActions(() => actions$)
            ]
        });

        effects = TestBed.get(InviteUserEffects);

    });

    describe('saveUser$', () => {
        it('should return a collection from user details - InviteUserSuccess', () => {
            const payload = [{ payload: 'something' }];
            InviteUsersServiceMock.inviteUser.and.returnValue(of(payload));
            const requestPayload = {
                firstName: 'Captain',
                lastName: 'Caveman',
                emailAddress: 'thecap@cave.com',
                permissions: ['god'],
                jurisdictions: []
            };
            const action = new SendInviteUser(requestPayload);
            const completion = new InviteUserSuccess([{ payload: 'something' }]);
            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: completion });
            expect(effects.saveUser$).toBeObservable(expected);
        });
    });

    describe('saveUser$ error', () => {
        it('should return InviteUserFail', () => {
            InviteUsersServiceMock.inviteUser.and.returnValue(throwError(new Error()));
            const requestPayload = {
                firstName: 'Captain',
                lastName: 'Caveman',
                emailAddress: 'thecap@cave.com',
                permissions: ['god'],
                jurisdictions: []
            };
            const action = new SendInviteUser(requestPayload);
            const completion = new InviteUserFail(new Error());
            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: completion });
            expect(effects.saveUser$).toBeObservable(expected);
        });
    });


});
