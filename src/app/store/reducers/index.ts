import * as fromHmctsIdentityBarReducer from './hmcts-identity-bar.reducer';
import * as fromRouterReducer from './router.reducer';

export const reducers = { ...fromHmctsIdentityBarReducer.hmctsIdentityBarReducer , ...fromRouterReducer.routerReducers };

export * from './router.reducer';
export * from './hmcts-identity-bar.reducer';
