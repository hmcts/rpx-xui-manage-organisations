import * as fromAcceptTCActions from '../actions';

export interface TermsAndCondition {
  hasUserAcceptedTC: boolean;
}

export const initialState: TermsAndCondition = {
  hasUserAcceptedTC: false,
};

export function reducer(
  state = initialState,
  action: fromAcceptTCActions.AceptTcActions
): TermsAndCondition {
  switch (action.type) {
    case fromAcceptTCActions.LOAD_HAS_ACCEPTED_TC_SUCCESS: {
      return {
        ...state,
        hasUserAcceptedTC: action.payload
      };
    }
  }

  return state;
}

export const getHasuserAcepted = (state: TermsAndCondition) => state.hasUserAcceptedTC;

