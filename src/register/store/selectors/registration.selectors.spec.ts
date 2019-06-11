import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import {RegistrationFormState} from '../reducers/registration.reducer';
import {getCurrentPageItems, getRegistrationPages, getRegistrationState} from './registration.selectors';
import {LoadPageItems} from '../actions/registration.actions';
import {reducers} from '../index';
import {LoadPageItemsSuccess} from '../actions';

describe('Registration selectors', () => {
  let store: Store<RegistrationFormState>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('registration', reducers),
      ],
    });
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getRegistrationState', () => {
    it('should return registration state', () => {
      let result;
      store.pipe(select(getRegistrationState)).subscribe(value => {
        result = value;

      });
      expect(result).toEqual({pages: {}, pagesValues: {}, loaded: false, loading: false, submitted: false});

      store.dispatch(new LoadPageItems('hello-world'));
      expect(result).toEqual({
        ...result,
        loading: true,
      });
    });
  });


  describe('getRegistrationPages', () => {
    it('should return registration  child pages state', () => {
      let result;
      store.pipe(select(getRegistrationPages)).subscribe(value => {
        result = value;

      });
      expect(result).toEqual({});
      const pageId = 'pageNameMock';
      store.dispatch(new LoadPageItemsSuccess({payload: { dummy: 'something'}, pageId}));
      expect(result).toEqual({
        pageNameMock: {
          dummy: 'something',
          loaded: true,
          loading: false
        }
    });
    });
  });

});
