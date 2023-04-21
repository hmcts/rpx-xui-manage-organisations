import * as fromAcceptTCActions from '../actions';

export interface TermsAndCondition {
  copy: any;
}

export const initialState: TermsAndCondition = {
  copy: ''
};

export function reducer(
  state = initialState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  action: fromAcceptTCActions.AceptTcActions
): TermsAndCondition {
  // switch (action.type) {
  //
  // }

  return state;
}

export const getTCCopy = (state: TermsAndCondition) => state.copy;

