import * as fromAction from '../actions'

const titles = {
  '/': 'Professional User Interface',
  'users': 'Users - Professional User Interface',
  'organisation': 'Organisation - Professional User Interface',
  'profile': 'Profile - Professional User Interface',
  'fee-accounts': 'Fee Accounts - Professional User Interface',
  'userform': 'Invite Users - Professional User Interface',
  'login': 'Login - Professional User Interface',
};

export interface AppState {
  allTitles: {[id: string]: string };
  pageTitle: string;
}

export const initialState: AppState = {
  allTitles: titles,
  pageTitle: ''
};

export function reducer(
  state = initialState,
  action: fromAction.appActions
): AppState {
  switch (action.type) {
    case fromAction.SET_PAGE_TITLE: {
      const title = action.payload.split('/')[0] === '' ?
        action.payload.split('/')[1] : action.payload.split('/')[0];
      const pageTitle = state.allTitles[title];
      return {
        ...state,
        pageTitle
      };
    }
  }

  return state;
}

export const getPageTitle = (state: AppState) => state.pageTitle;


