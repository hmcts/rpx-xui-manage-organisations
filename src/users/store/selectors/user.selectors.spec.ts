
import { UsersListState } from '../reducers/users.reducer';
import { getUserState, getGetSingleUser } from './user.selectors';
import { UserState } from '../reducers';

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
    loading: false
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

});
