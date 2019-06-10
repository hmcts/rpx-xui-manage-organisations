import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as fromUsersEffects from './users.effects';
import { UsersEffects } from './users.effects';
import { LoadUsersSuccess, LoadUsersFail, LoadUsers, SendInviteUser, InviteUserSuccess, InviteUserFail } from '../actions/user.actions';
import { UsersService } from '../../services/users.service';
import { InviteUserService } from '../../services/invite-user.service';
import { AddFromData } from '../actions/invite-user.actions';

describe('Users Effects', () => {
    let actions$;
    let effects: UsersEffects;
    const UsersServiceMock = jasmine.createSpyObj('UsersService', [
        'getListOfUsers',
    ]);

    const InviteUsersServiceMock = jasmine.createSpyObj('InviteUserService', [
        'inviteUser',
    ]);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: UsersService,
                    useValue: UsersServiceMock,
                },
                {
                    provide: InviteUserService,
                    useValue: InviteUsersServiceMock,
                },
                fromUsersEffects.UsersEffects,
                provideMockActions(() => actions$)
            ]
        });

        effects = TestBed.get(UsersEffects);

    });

    describe('loadUsers$', () => {
        it('should return a collection from loadUsers$ - LoadUsersSuccess', () => {
            const payload = [{ payload: 'something' }];
            UsersServiceMock.getListOfUsers.and.returnValue(of(payload));
            const action = new LoadUsers();
            const completion = new LoadUsersSuccess([{ payload: 'something' }]);
            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: completion });
            expect(effects.loadUsers$).toBeObservable(expected);
        });
    });

    describe('loadUsers$ error', () => {
        it('should return LoadUsersFail', () => {
            UsersServiceMock.getListOfUsers.and.returnValue(throwError(new Error()));
            const action = new LoadUsers();
            const completion = new LoadUsersFail(new Error());
            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: completion });
            expect(effects.loadUsers$).toBeObservable(expected);
        });
    });

    describe('saveUsers$', () => {
        it('should return a collection from user details - InviteUserSuccess', () => {
            const payload = [{ payload: 'something' }];
            InviteUsersServiceMock.inviteUser.and.returnValue(of(payload));
            const requestPayload = {
                firstName: 'Captain',
                lastName: 'Caveman',
                emailAddress: 'thecap@cave.com',
                permissions: ['god']
            };
            const action = new SendInviteUser(requestPayload);
            const completion = new InviteUserSuccess([{ payload: 'something' }]);
            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: completion });
            expect(effects.saveUsers$).toBeObservable(expected);
        });
    });

    describe('saveUsers$ error', () => {
        it('should return InviteUserFail', () => {
            InviteUsersServiceMock.inviteUser.and.returnValue(throwError(new Error()));
            const requestPayload = {
                firstName: 'Captain',
                lastName: 'Caveman',
                emailAddress: 'thecap@cave.com',
                permissions: ['god']
            };
            const action = new SendInviteUser(requestPayload);
            const completion = new InviteUserFail(new Error());
            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: completion });
            expect(effects.saveUsers$).toBeObservable(expected);
        });
    });


});
