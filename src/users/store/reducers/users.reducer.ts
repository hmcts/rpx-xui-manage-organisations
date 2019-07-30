import * as fromUsers from '../actions/user.actions';
import {AppUtils} from 'src/app/utils/app-utils';

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

      userListPayload[0].roles = ['pui-organisation-manager','pui-user-manager','pui-case-manager']

      const userList = userListPayload.map((user) => {

        const userRoles = [
          { hasAccess: user.roles.includes('pui-organisation-manager') ? 'Yes' : 'No' , accessRole: 'manageOrganisations'},
          { hasAccess: user.roles.includes('pui-user-manager') ? 'Yes' : 'No', accessRole: 'manageUsers' },
          { hasAccess: user.roles.includes('pui-case-manager') ? 'Yes' : 'No', accessRole: 'manageCases' },
        ];

        const statusCapitalised = AppUtils.capitalizeString(user.status)

        user.status = statusCapitalised;
        user[userRoles[0].accessRole] = userRoles[0].hasAccess;
        user[userRoles[1].accessRole] = userRoles[1].hasAccess;
        user[userRoles[2].accessRole] = userRoles[2].hasAccess;

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

