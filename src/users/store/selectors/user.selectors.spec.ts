
import { UserState } from '../reducers';
import { UsersListState } from '../reducers/users.reducer';
import {editUserFailureSelector, getGetSingleUser, getUserState} from './user.selectors';
import {User} from '@hmcts/rpx-xui-common-lib';
import * as fromUsers from '../reducers/users.reducer';

const userList = [
    {
        firstName: 'Test1firstname',
        lastName: 'Test1lastname',
        email: 'somthing1@something',
        status: 'active',
        roles: 'blabla1',
        userIdentifier: 'userId1'
    },
    {
        firstName: 'Test2fggftfirstname',
        lastName: 'Test2gfgtlastname',
        email: 'somthing2@somffgething',
        status: 'active',
        roles: 'blabfgfgla',
        userIdentifier: 'userId2'
    }
];

const mockUserListState: UsersListState = {
    userList,
    loaded: true,
    loading: false,
    reinvitePendingUser: null,
    editUserFailure: false,
};

const mockUserState: UserState = {
    inviteUser: null,
    invitedUsers: mockUserListState
};

describe('User selectors', () => {

    describe('getUserState', () => {
        it('should return user list state', () => {

            expect(getUserState({users: mockUserState})).toEqual(mockUserListState);
        });
    });

    describe('getGetSingleUser', () => {
        it('should return single user', () => {

            const expectedUser = {
                firstName: 'Test2fggftfirstname',
                lastName: 'Test2gfgtlastname',
                email: 'somthing2@somffgething',
                status: 'active',
                roles: 'blabfgfgla',
                userIdentifier: 'userId2'
            };

            expect(getGetSingleUser({users: mockUserState}, { userIdentifier: 'userId2' })).toEqual(expectedUser);
        });
    });

    describe('editUserFailureSelector', () => {
      it('should get the edit user failure state', () => {
        expect(editUserFailureSelector({ users: mockUserState })).toBeFalsy();
      });
    });
});
