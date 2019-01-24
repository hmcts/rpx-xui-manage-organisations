import { Action } from '@ngrx/store';

export const DISPLAY_BAR = '[hmcts-identity-bar] Display';
export const HIDE_BAR = '[hmcts-identity-bar] Hide';

export class DisplayIdentityBar implements Action {
  readonly type = DISPLAY_BAR;
  constructor(
    public payload: {
      value: string;
    }
  ) {}
}

export class HideIdentityBar implements Action {
  readonly type = HIDE_BAR;
}


export type IdentityBarActions = DisplayIdentityBar | HideIdentityBar;
