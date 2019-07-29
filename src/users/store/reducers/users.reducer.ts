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
      let userList = action.payload.users;
      console.log('User list is',userList)

      let newData = userList.map((item) => 
      Object.assign({}, item, {selected:false})
      )

      console.log('New user list is',newData)

      const userListMapped = [
        {
          email: action.payload.users[0].email,
          status: action.payload.users[0].status,
          roles: [  
            "pui-organisation-manager",
            "pui-user-manager",
            "pui-finance-manager",
            "pui-case-manager"
          ]
        },
        {
          email: action.payload.users[1].email,
          status: action.payload.users[1].status,
          roles: [  
            "pui-organisation-manager",
            "pui-user-manager",
            "pui-finance-manager",
            "pui-case-manager"
          ]
        }
    
      ]

      var users = userListMapped.map(function (user) {
        
        var isOrgManager = user.roles.includes("pui-organisation-manager");
        var isUserManager = user.roles.includes("pui-user-manager");
        var isCaseManager = user.roles.includes("pui-case-manager");

        var userRoles = [isOrgManager,isUserManager, isCaseManager];
        var userRolesMapped = ['manageOrganisations','manageUsers','manageCases']

        for (var userRolesCount = 0; userRolesCount < userRoles.length; userRolesCount++) {

          if(userRoles[userRolesCount])
          {
            user[userRolesMapped[userRolesCount]] = 'yes'
          }
          else
          {
            user[userRolesMapped[userRolesCount]] = 'no'
          }
          }

        return user
      });

      console.log('users are',users)

      userList = users
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

