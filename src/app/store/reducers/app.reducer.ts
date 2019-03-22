import * as fromAction from '../actions';

/* function that returns page title base on page url indexOf */
export function setPageTitle(url): string {
  if (url.indexOf('invite-user') !== -1) {
    return 'Invite Users - Professional User Interface ';
  } else if (url.indexOf('organisation') !== -1) {
    return 'Organisation - Professional User Interface';
  } else if (url.indexOf('profile') !== -1) {
    return 'Profile - Professional User Interface';
  } else if (url.indexOf('users') !== -1) {
    return 'Users - Professional User Interface';
  } else if (url.indexOf('login') !== -1) {
    return 'Login - Professional User Interface';
  }
  return 'Professional User Interface';
}

export interface AppState {
  pageTitle: string;
}

export const initialState: AppState = {
  pageTitle: ''
};

export function reducer(
  state = initialState,
  action: fromAction.appActions
): AppState {
  switch (action.type) {
    case fromAction.SET_PAGE_TITLE: {
      const pageTitle = setPageTitle(action.payload);
      return {
        ...state,
        pageTitle
      };
    }

    case fromAction.SET_PAGE_TITLE_ERRORS: {
      const pageTitle = 'Error: ' + state.pageTitle;
      return {
        ...state,
        pageTitle
      };
    }
  }

  return state;
}

export const getPageTitle = (state: AppState) => state.pageTitle;


