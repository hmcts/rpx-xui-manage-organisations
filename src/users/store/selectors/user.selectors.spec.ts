import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { UsersState } from '../reducers/users.reducer';
import { getGetUserList, getUserState } from './user.selectors';
import { reducers } from '../index';
import { UpdateErrorMessages } from '../actions';



fdescribe('User selectors', () => {
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


    describe('getGetUserList', () => {
        it('should return user array objects', () => {
            let result;
            store.pipe(select(getGetUserList)).subscribe(value => {
                result = value;


            });
            //expect(result).toEqual(null);


            const dummy = [
                {
                    email: 'somthing@something',
                    manageCases: 'All',
                    manageOrganisation: 'Yes',
                    manageUsers: 'yes',
                    manageFeeAcc: 'yes',
                    status: 'active'
                },
                {
                    email: 'xyz@something',
                    manageCases: 'All',
                    manageOrganisation: 'Yes',
                    manageUsers: 'no',
                    manageFeeAcc: 'no',
                    status: 'active'
                }
            ]

            store.dispatch(new LoadUsersSuccess(dummy));

            expect(result).toEqual(dummy);
        });
    });

});
