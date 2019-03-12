const titles = {
  '/': 'Professional User Interface',
  'users': 'Users - Professional User Interface',
  'organisation': 'Organisation - Professional User Interface',
  'profile': 'Profile - Professional User Interface',
  'feeaccounts': 'Fee Accounts - Professional User Interface',
  'userform': 'Invite Users - Professional User Interface',
  'login': 'Login - Professional User Interface',
};

export interface AppState {
  titles: {[id: string]: string };
}

export const initialState: AppState = {
  titles
};

export function reducer(
  state = initialState,
  action
): AppState {
  switch (action.type) {

  }

  return state;
}

export const getInviteUserData = (state: AppState) => state.titles;


