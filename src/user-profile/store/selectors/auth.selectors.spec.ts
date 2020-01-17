import { TestBed } from '@angular/core/testing';
import {StoreModule, Store, combineReducers, select} from '@ngrx/store';

import * as fromRoot from '../../../app/store/reducers';
import * as fromReducers from '../reducers';
import * as fromActions from '../actions';
import * as fromSelectors from './auth.selectors';



describe('App Selectors', () => {
  let store: Store<fromReducers.AuthState>;

  const appConfig = {
    config: {},
    userDetails: null,
    modal: {
      session: {
        isVisible: false,
        countdown: ''
      }
    },
    loaded: false,
    loading: false
  };

  const appPayload = {
    features: {
      ccdCaseCreate: {
        isEnabled: true,
        label: 'CCDCaseCreate'
      }
    }
  };

  const appConfigLoaded = {
    config: {
      features: {
        ccdCaseCreate: {
          isEnabled: true,
          label: 'CCDCaseCreate'
        }
      }
    },
    user: null,
    modal: {
      session: {
        isVisible: false,
        countdown: ''
      }
    },
    loaded: true,
    loading: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          userProfile: combineReducers(fromReducers.reducer),
        }),
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('User Profile State', () => {

    it('should return userDetails state', () => {
      let result;
      const payload = {
        email: 'test@email.com',
        orgId: '123',
        roles: ['some-role'],
        userId: '321'
      }

      store.pipe(select(fromSelectors.getUsers))
        .subscribe(value => (result = value));

      store.dispatch(new fromActions.GetUserDetailsSuccess(payload));
      expect(result).toEqual(appConfigLoaded.user);
    });

    it('should return getUserIdleTime state', () => {
      let result;

      store.pipe(select(fromSelectors.getUserIdleTime))
        .subscribe(value => (result = value));

      store.dispatch(new fromActions.GetUserDetails());
      expect(result).toEqual(NaN);
    });

    it('should return getUserIdleTime state', () => {
      let result;

      store.pipe(select(fromSelectors.getUserTimeOut))
        .subscribe(value => (result = value));

      store.dispatch(new fromActions.GetUserDetails());
      expect(result).toEqual(NaN);
    });

    it('should return getModalSessionData state', () => {
      let result;

      store.pipe(select(fromSelectors.getModalSessionData))
        .subscribe(value => (result = value));

      store.dispatch(new fromActions.GetUserDetails());
      expect(result).toEqual({});
    });

  });


});
