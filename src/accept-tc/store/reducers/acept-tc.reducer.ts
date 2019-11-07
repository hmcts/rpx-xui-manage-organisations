import * as fromAcceptTCActions from '../actions';

export interface TermsAndCondition {
  copy: any;
}

export const initialState: TermsAndCondition = {
  copy: '',
};

export function reducer(
  state = initialState,
  action: fromAcceptTCActions.AceptTcActions
): TermsAndCondition {
  // switch (action.type) {
  //
  // }

  return state;
}

export const getTCCopy = (state: TermsAndCondition) => state.copy;

