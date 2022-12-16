import {
  ActivatedRouteSnapshot,
  Params,
  RouterStateSnapshot,
} from '@angular/router';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRouter from '@ngrx/router-store';
import * as fromApp from '../reducers/app.reducer';
import { Injectable } from '@angular/core';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface State {
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
  appState: fromApp.AppState;
}

export const reducers: ActionReducerMap<State> = {
  routerReducer: fromRouter.routerReducer,
  appState: fromApp.reducer,
};

export const getRouterState = createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>(
  'routerReducer'
);

export const getRootAppState = createFeatureSelector<fromApp.AppState>(
  'appState'
);

export const getRouterUrl = createSelector(
  getRouterState,
  state => state.state.url
);

@Injectable()
export class CustomSerializer
  implements fromRouter.RouterStateSerializer<RouterStateUrl> {
  public serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const { queryParams } = routerState.root;

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params } = state;

    return { url, queryParams, params };
  }
}
