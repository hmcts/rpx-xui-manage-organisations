
import { UsersListState, SelectedUserState } from '../reducers/users.reducer';
import { getUserState, getSelectedUserState } from './user.selectors';
import { UserState } from '../reducers';
import { User } from '../../models/user.model';

const userList: User[] = [
    {
        firstName: 'Test1firstname',
        lastName: 'Test1lastname',
        email: 'somthing1@something',
        roles: ['blabla1'],
        userIdentifier: 'userId1',
        idamMessage: '',
        idamStatusCode: '',
        idamStatus: ''
    },
    {
        firstName: 'Test2fggftfirstname',
        lastName: 'Test2gfgtlastname',
        email: 'somthing2@somffgething',
        roles: ['blabfgfgla'],
        userIdentifier: 'userId2',
        idamMessage: '',
        idamStatusCode: '',
        idamStatus: ''
    }
];

const mockUserListState: UsersListState = {
    userList,
    loaded: true,
    loading: false
};

const mockSelectedUserState: SelectedUserState = {
    user: userList[1],
    loaded: true,
    loading: false
};

const mockUserState: UserState = {
    inviteUser: null,
    invitedUsers: mockUserListState,
    selectedUser: mockSelectedUserState
};

describe('User selectors', () => {

    describe('getUserState', () => {
        it('should return user list state', () => {

            expect(getUserState({users: mockUserState})).toEqual(mockUserListState);
        });
    });

    describe('getSelectedUser', () => {
        it('should return selected user', () => {

            expect(getSelectedUserState({users: mockUserState})).toEqual(mockSelectedUserState);
        });
    });

});
