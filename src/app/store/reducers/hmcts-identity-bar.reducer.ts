import * as fromHmctsIdentityBar from '../actions/hmcts-identity-bar.action';
import { ActionReducerMap } from '@ngrx/store';


export interface HmctsIdentityBarState {
  value: string;
  visible: boolean;
}

export const initialState: HmctsIdentityBarState = {
  value: null,
  visible: false
};

export function hmctsIdentityBarReducer(
  state = initialState,
  action: fromHmctsIdentityBar.IdentityBarActions
): HmctsIdentityBarState {
  switch (action.type) {
    case fromHmctsIdentityBar.HIDE_BAR: {
      return state;
    }

    case fromHmctsIdentityBar.DISPLAY_BAR: {
      return {
        value:  action.payload.value,
        visible: true
      };
    }
  }

  return state;
}

export interface IdentityBarState {
    hmctsIdentityBarState: HmctsIdentityBarState;
}

export const hmctsIdentityBarReducers: ActionReducerMap<IdentityBarState> = {
    hmctsIdentityBarState: hmctsIdentityBarReducer
};
