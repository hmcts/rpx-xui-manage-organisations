import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromUsers from './users.reducer';
import * as fromStyleGuide from './style-guide.reducer';

export interface UserState {
  guide: fromStyleGuide.StyleGuideState;
}

export const reducers: ActionReducerMap<UserState> = {
  guide: fromStyleGuide.reducer
};

export const getRootUserState = createFeatureSelector<UserState>(
  'styleGuide'
);




