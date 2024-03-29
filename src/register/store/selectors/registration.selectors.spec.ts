import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { LoadPageItemsSuccess } from '../actions';
import { LoadPageItems, SubmitFormDataFail } from '../actions/registration.actions';
import { reducers } from '../index';
import { RegistrationFormState } from '../reducers/registration.reducer';
import { getErrorMessages, getRegistrationPages, getRegistrationState } from './registration.selectors';

describe('Registration selectors', () => {
  let store: Store<RegistrationFormState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('registration', reducers)
      ]
    });
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  xdescribe('getRegistrationState', () => {
    it('should return registration state', () => {
      let result;
      store.pipe(select(getRegistrationState)).subscribe((value) => {
        result = value;
      });
      expect(result).toEqual({ pages: {}, pagesValues: {}, loaded: false, loading: false, submitted: false });

      store.dispatch(new LoadPageItems('hello-world'));
      expect(result).toEqual({
        ...result,
        loading: true
      });
    });
  });

  describe('getRegistrationPages', () => {
    it('should return registration  child pages state', () => {
      let result;
      store.pipe(select(getRegistrationPages)).subscribe((value) => {
        result = value;
      });
      expect(result).toEqual({});
      const pageId = 'pageNameMock';
      store.dispatch(new LoadPageItemsSuccess({ payload: { dummy: 'something' }, pageId }));
      expect(result).toEqual({
        pageNameMock: {
          dummy: 'something',
          init: true,
          loaded: true,
          loading: false
        }
      });
    });
  });

  describe('getErrorMessages', () => {
    it('should return errorMessage state', () => {
      let result;
      store.pipe(select(getErrorMessages)).subscribe((value) => {
        result = value;
      });
      expect(result).toEqual('');
      const payload = { error: { apiError: 'Undefined error' }, status: '500' };
      store.dispatch(new SubmitFormDataFail(payload));
      expect(result).toEqual('Sorry, there is a problem with the service. Try again later');
    });
  });
});
