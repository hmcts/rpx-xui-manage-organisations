import * as fromUsers from '../actions/user.actions';


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
      let payload = action.payload.users;

      let userListPayload = payload.map((item) =>
        Object.assign({}, item, { selected: false })
      )

      var userList = userListPayload.map(function (user) {

        var userRoles = [
          { hasAccess: user.roles.includes("pui-organisation-manager"), accessRole: 'manageOrganisations', allowAccess: "" },
          { hasAccess: user.roles.includes("pui-user-manager"), accessRole: 'manageUsers', allowAccess: "" },
          { hasAccess: user.roles.includes("pui-case-manager"), accessRole: 'manageCases', allowAccess: "" },
        ];

        var mappedRoles = userRoles.map(function (userRole) {

          if (userRole.hasAccess) {
            userRole.allowAccess = 'yes'
          }
          else {
            userRole.allowAccess = 'no'
          }
          return userRole
        });

        user[mappedRoles[0].accessRole] = mappedRoles[0].allowAccess
        user[mappedRoles[1].accessRole] = mappedRoles[1].allowAccess
        user[mappedRoles[2].accessRole] = mappedRoles[2].allowAccess

        return user
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

