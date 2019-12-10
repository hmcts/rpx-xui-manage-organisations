import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as fromUsersEffects from './users.effects';
import { UsersEffects } from './users.effects';
import { LoadUsersSuccess, LoadUsersFail, LoadUsers } from '../actions/user.actions';
import { UsersService } from '../../services/users.service';
import { User } from '../../../users/models/user.model';

describe('Users Effects', () => {
    let actions$;
    let effects: UsersEffects;
    const UsersServiceMock = jasmine.createSpyObj('UsersService', [
        'getListOfUsers',
    ]);


    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: UsersService,
                    useValue: UsersServiceMock,
                },
                fromUsersEffects.UsersEffects,
                provideMockActions(() => actions$)
            ]
        });

        effects = TestBed.get(UsersEffects);

    });

    describe('loadUsers$', () => {
        it('should return a collection from loadUsers$ - LoadUsersSuccess', () => {
            const user1: User = {
                email: 'dummy',
                firstName: 'dummy',
                idamMessage: 'dummy',
                idamStatus: 'dummy',
                idamStatusCode: 'dummy',
                lastName: 'dummy',
                userIdentifier: 'dummy',
            };
            const payload = {users: [user1]};
            UsersServiceMock.getListOfUsers.and.returnValue(of(payload));
            const action = new LoadUsers();
            const completion = new LoadUsersSuccess({
                users: [
                    {
                        ...user1,
                        fullName: 'dummy dummy',
                        routerLink: 'user/dummy'
                    }
                ]
            });
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

});
