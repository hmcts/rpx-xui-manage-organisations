import * as fromUsers from '../actions/user.actions';
import {AppUtils} from 'src/app/utils/app-utils';
import { AppConstants } from 'src/app/app.constants';
import { User } from 'src/users/models/user.model';

export interface UsersListState {
  userList: User[];
  loaded: boolean;
  loading: boolean;
}

export interface SelectedUserState {
  user: User;
  loaded: boolean;
  loading: boolean;
}

export const initialUsersListState: UsersListState = {
  userList: [],
  loaded: false,
  loading: false,
};

export const initialUserState: SelectedUserState = {
  user: {
    email: '',
    firstName: '',
    idamMessage: '',
    idamStatus: '',
    idamStatusCode: '',
    lastName: '',
    userIdentifier: ''
  },
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialUsersListState,
  action: fromUsers.UserActions
): UsersListState {
  switch (action.type) {

    case fromUsers.LOAD_USERS: {
      const userList = [];
      return {
        ...state,
        userList,
        loading: true
      };
    }

    case fromUsers.LOAD_USERS_SUCCESS: {
      const payload = action.payload ? action.payload.users : null;

      const userListPayload = payload.map((item) => {
        return {
          ...item,
          selected: false
        };
      }
      );

      const userList = userListPayload.map((user) => {

        AppConstants.USER_ROLES.map((userRoles) => {
          if (user.roles) {
            user[userRoles.roleType] = user.roles.includes(userRoles.role) ? 'Yes' : 'No';
          }
         });

        user.status = AppUtils.capitalizeString(user.idamStatus);

        return user;
      });

      return {
        ...state,
        userList,
        loaded: true,
        loading: false
      };
    }


    case fromUsers.LOAD_USERS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

  }

  return state;
}


export function selectedUserReducer(
  state = initialUserState,
  action: fromUsers.UserActions
): SelectedUserState {
  switch (action.type) {

    case fromUsers.LOAD_SELECTED_USER: {
      const user = {
        email: '',
        firstName: '',
        idamMessage: '',
        idamStatus: '',
        idamStatusCode: '',
        lastName: '',
        userIdentifier: ''
      };
      return {
        ...state,
        user,
        loading: true
      };
    }

    case fromUsers.LOAD_SELECTED_USER_SUCCESS: {
      const user = action.payload;
      return {
        ...state,
        user,
        loaded: true,
        loading: false
      };
    }


    case fromUsers.LOAD_SELECTED_USER_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }
  }

  return state;
}

export const getUsers = (state: UsersListState) => state.userList;
export const getUsersLoading = (state: UsersListState) => state.loading;
export const getUsersLoaded = (state: UsersListState) => state.loaded;

export const getSelectedUser = (state: SelectedUserState) => state.user;
export const getSelectedUserLoading = (state: SelectedUserState) => state.loading;
export const getSelectedUserLoaded = (state: SelectedUserState) => state.loaded;

