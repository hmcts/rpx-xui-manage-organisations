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
        }
      }
      );

      userListPayload[0].roles = ['pui-user-manager','pui-case-manager']

      const userList = userListPayload.map((user) => {

        var userRolesMapped = AppConstants.USER_ROLES.map(function (role) {
          console.log('user roles',user.roles)
          return {accessRole : role.hasRole, hasAccess: user.roles.includes(role.role) ? 'Yes' : 'No'}
        });

        console.log('user roles mapped is', userRolesMapped)

        user.status = AppUtils.capitalizeString(user.status)
        user[userRolesMapped[0].accessRole] = userRolesMapped[0].hasAccess;
        user[userRolesMapped[1].accessRole] = userRolesMapped[1].hasAccess;
        user[userRolesMapped[2].accessRole] = userRolesMapped[2].hasAccess;

        return user;
      });

      console.log('payload is',userList)

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

