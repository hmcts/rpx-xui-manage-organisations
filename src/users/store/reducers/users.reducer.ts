import * as fromUsers from '../actions/user.actions';
import {AppUtils} from 'src/app/utils/app-utils';
import { AppConstants } from 'src/app/app.constants';

export interface UsersListState {
  userList: object[];
  loaded: boolean;
  loading: boolean;
}

export const initialState: UsersListState = {
  userList: [],
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
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

      const payload = [...action.payload.users];

      const userListPayload = payload.map((item) => {
        return {
          ...item,
          selected: false
        };
      }
      );
      userListPayload[0].roles = ['pui-organisation-manager', 'pui-user-manager'];
      userListPayload[2].roles = ['pui-case-manager', 'pui-user-manager'];
      userListPayload[1].roles = ['pui-case-manager'];

      const userList = userListPayload.map((user) => {

        AppConstants.USER_ROLES.map((role) => {
          user[role.hasRole] = user.roles.includes(role.role) ? 'Yes' : 'No';
         });

        user.status = AppUtils.capitalizeString(user.status);

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

export const getUsers = (state: UsersListState) => state.userList;
export const getLoginFormLoading = (state: UsersListState) => state.loading;
export const getLoginFormLoaded = (state: UsersListState) => state.loaded;

