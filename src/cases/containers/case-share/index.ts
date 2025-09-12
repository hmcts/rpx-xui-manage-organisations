import { Params } from '@angular/router';
import * as fromNgrxRouter from '@ngrx/router-store';
import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

// import * as fromAuth from './auth.reducer';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface State {
  routerX: fromNgrxRouter.RouterReducerState<RouterStateUrl>;
  // auth: fromAuth.AuthState;
}

export const reducers: ActionReducerMap<State> = {
  routerX: fromNgrxRouter.routerReducer
  // auth: fromAuth.reducer,
};

export const getRouterState =
  createFeatureSelector<fromNgrxRouter.RouterReducerState<RouterStateUrl>>(
    'routerX'
  );

export const getRouterStateUrl = createSelector(
  getRouterState,
  (routerState: fromNgrxRouter.RouterReducerState<RouterStateUrl>) =>
    routerState.state
);

export const isSomeIdParamValid = createSelector(getRouterState, (routerS) => {
  return (
    routerS &&
    routerS.state &&
    routerS.state.params &&
    routerS.state.params.someId
  );
});
