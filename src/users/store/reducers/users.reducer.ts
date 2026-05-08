import { User } from '@hmcts/rpx-xui-common-lib';
import { AppConstants } from '../../../app/app.constants';
import { AppUtils } from '../../../app/utils/app-utils';
import * as fromUsers from '../actions/user.actions';

export const USER_LIST_CACHE_DURATION_MS = 5 * 60 * 1000;

export interface UsersListState {
  userList: User[];
  loaded: boolean;
  loading: boolean;
  userListLastLoaded: number;
  reinvitePendingUser: User;
  editUserFailure: boolean;
  userDetails: User;
  loadUserListNeeded?: boolean;
}

export const initialState: UsersListState = {
  userList: [] as User[],
  loaded: false,
  loading: false,
  userListLastLoaded: 0,
  reinvitePendingUser: null,
  editUserFailure: false,
  userDetails: null,
  loadUserListNeeded: false
};

export function reducer(
  state = initialState,
  action: fromUsers.UserActions
): UsersListState {
  switch (action.type) {
    case fromUsers.CHECK_USER_LIST_LOADED: {
      const cacheExpired = state.loaded && state.userListLastLoaded > 0 &&
        action.payload.currentTime - state.userListLastLoaded >= USER_LIST_CACHE_DURATION_MS;
      const hasNoCachedUserList = !state.loaded || state.userListLastLoaded === 0;
      return {
        ...state,
        loadUserListNeeded: !state.loading && (hasNoCachedUserList || cacheExpired)
      };
    }

    case fromUsers.INVALIDATE_USER_LIST_CACHE: {
      return {
        ...state,
        loaded: false,
        userListLastLoaded: 0,
        loadUserListNeeded: true
      };
    }

    case fromUsers.LOAD_USERS: {
      const userList = [];
      return {
        ...state,
        userList,
        loading: true
      };
    }

    case fromUsers.LOAD_ALL_USERS_NO_ROLE_DATA: {
      return {
        ...state,
        loading: true,
        loadUserListNeeded: false
      };
    }

    case fromUsers.LOAD_USERS_SUCCESS:
    case fromUsers.LOAD_ALL_USERS_NO_ROLE_DATA_SUCCESS: {
      const shouldCacheUserList = action.type === fromUsers.LOAD_ALL_USERS_NO_ROLE_DATA_SUCCESS;
      const payload = action.payload ? action.payload.users : null;

      const userListPayload = payload.map((item) => {
        return {
          ...item,
          selected: false
        };
      }
      );

      const userList = userListPayload.map((user) => {
        user.status = AppUtils.capitalizeString(user.idamStatus);

        AppConstants.USER_ROLES.forEach((userRoles) => {
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
        loading: false,
        userListLastLoaded: shouldCacheUserList ? Date.now() : state.userListLastLoaded,
        loadUserListNeeded: shouldCacheUserList ? false : state.loadUserListNeeded
      };
    }

    case fromUsers.LOAD_USERS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

    case fromUsers.LOAD_ALL_USERS_NO_ROLE_DATA_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: state.loaded
      };
    }

    case fromUsers.SUSPEND_USER: {
      return {
        ...state,
        loading: true,
        loaded: true
      };
    }

    case fromUsers.SUSPEND_USER_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: true
      };
    }

    case fromUsers.SUSPEND_USER_SUCCESS: {
      const user = action.payload ? action.payload : null;

      const userDetails = { ...user };
      userDetails.idamStatus = 'SUSPENDED';
      userDetails.status = 'Suspended';

      return {
        ...state,
        userDetails,
        loading: false,
        loaded: true
      };
    }

    case fromUsers.INVITE_NEW_USER: {
      return {
        ...state,
        reinvitePendingUser: null,
        userDetails: null
      };
    }

    case fromUsers.REINVITE_PENDING_USER: {
      return {
        ...state,
        reinvitePendingUser: action.payload
      };
    }

    // Initialise Editing of User, resetting the state back to editing of a User.
    case fromUsers.EDIT_USER: {
      return {
        ...state,
        editUserFailure: false
      };
    }

    case fromUsers.EDIT_USER_FAILURE: {
      return {
        ...state,
        editUserFailure: true
      };
    }

    case fromUsers.EDIT_USER_FAILURE_RESET: {
      return {
        ...state,
        editUserFailure: false
      };
    }

    case fromUsers.LOAD_USER_DETAILS: {
      return {
        ...state,
        userDetails: action.payload
      };
    }

    case fromUsers.LOAD_USER_DETAILS_SUCCESS: {
      const payload = action.payload ? action.payload : null;
      const userDetailsPayload = {
        ...payload,
        selected: false
      };

      AppConstants.USER_ROLES.forEach((userRoles) => {
        if (userDetailsPayload.roles) {
          userDetailsPayload[userRoles.roleType] = userDetailsPayload.roles.includes(userRoles.role) ? 'Yes' : 'No';
        }
      });

      userDetailsPayload.status = AppUtils.capitalizeString(userDetailsPayload.idamStatus);

      return {
        ...state,
        userDetails: userDetailsPayload,
        loaded: true,
        loading: false
      };
    }

    default:
      return state;
  }
}

export const getUsers = (state: UsersListState) => state.userList;
export const getUsersLoading = (state: UsersListState) => state.loading;
export const getUsersLoaded = (state: UsersListState) => state.loaded;
export const getReinvitePendingUser = (state: UsersListState) => state.reinvitePendingUser;
export const getEditUserFailure = (state: UsersListState) => state.editUserFailure;
export const getUserDetails = (state: UsersListState) => state.userDetails;
export const getLoadUserListNeeded = (state: UsersListState) => state.loadUserListNeeded;
