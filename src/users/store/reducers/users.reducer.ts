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
      console.log('User list last name is',userList[0].lastName)

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
        }]
        
        var puiOrganisationManager = mappedList[0].roles.includes("pui-organisation-manager");
        var puiUserManager = mappedList[0].roles.includes("pui-user-manager");
        var puiCaseManager = mappedList[0].roles.includes("pui-case-manager");

  
        var managerArray = [puiOrganisationManager,puiUserManager, puiCaseManager];
        var allowManage = ['manageOrganisations','manageUsers','manageCases']
        var arrayLength = managerArray.length;
        for (var i = 0; i < arrayLength; i++) {
        console.log(managerArray[i]);
        //Do something
        if(managerArray[i])
        {
          console.log('role is included')
          mappedList[0][allowManage[i]] = 'yes'
          console.log(i)
        }
        else
        {
          console.log('role is not incuded')
          mappedList[0][allowManage[i]] = 'no'
        }
        }

        /*if(puiOrganisationManager) 
        {
          console.log('role is included')
          mappedList[0]['manageCases'] = 'yes'
        }
        if(!puiOrganisationManager)
        {
          console.log('role is not included')
        }*/

      console.log('Test list is',mappedList)
      console.log(userList)

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

