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

      const mappedList = [
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
        }]
        
        for(var x = 0; x < mappedList.length; x++)
        {
          var puiOrganisationManager = mappedList[x].roles.includes("pui-organisation-manager");
          var puiUserManager = mappedList[x].roles.includes("pui-user-manager");
          var puiCaseManager = mappedList[x].roles.includes("pui-case-manager");
  
    
          var managerArray = [puiOrganisationManager,puiUserManager, puiCaseManager];
          var allowManage = ['manageOrganisations','manageUsers','manageCases']

          for (var i = 0; i < managerArray.length; i++) {

            if(managerArray[i])
            {
              mappedList[x][allowManage[i]] = 'yes'
            }
            else
            {
              mappedList[x][allowManage[i]] = 'no'
            }
            }

        }

      console.log('Mapped list is',mappedList)

      userList = mappedList
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

