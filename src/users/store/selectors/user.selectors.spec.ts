import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { UsersState } from '../reducers/users.reducer';
import { getGetUserList, getUserState } from './user.selectors';
import { reducers } from '../index';
import { UpdateErrorMessages, LoadUsersSuccess } from '../actions';



describe('User selectors', () => {
    let store: Store<UsersState>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({}),
                StoreModule.forFeature('users', reducers),
            ],
        });
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();
    });



    describe('getUserState', () => {
        it('should return user state', () => {
            let result;
            store.pipe(select(getUserState)).subscribe(value => {
                result = value;
            });

            expect(result).toEqual({ users: [], loaded: false, loading: false });
        });
    });

/*   TO DO - write proper unit test

    describe('getGetUserList', () => {
        it('should return user array objects', () => {
            let result;
            store.pipe(select(getGetUserList)).subscribe(value => {
                result = value;


            });

            const dummy = [
                {
                  firstName: 'Testfirstname',
                  lastName: 'Testlastname',
                    email: 'somthing@something',
                    status: 'active',
                  roles: 'blabla'
                },
                {
                  firstName: 'Tesfggftfirstname',
                  lastName: 'Tesgfgtlastname',
                  email: 'somthing@somffgething',
                  status: 'active',
                  roles: 'blabfgfgla'
                }
            ];

            store.dispatch(new LoadUsersSuccess(dummy));

            expect(result).toEqual(dummy);
        });
    });
*/
});
