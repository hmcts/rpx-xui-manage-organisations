import {initialState, reducer} from './registration.reducer';
import {LoadPageItems, SubmitFormDataFail, ResetErrorMessage} from '../actions/registration.actions';
import {LoadPageItemsSuccess} from '../actions';

describe('RegistrationReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = reducer( undefined, action);
      expect(state).toEqual(initialState);
    });
  });
  describe('LOAD_PAGE_ITEMS action', () => {
    it('should set loading to true', () => {
      const action = new LoadPageItems('something');
      const state = reducer(initialState, action);
      expect(state.loading).toEqual(true);
    });
  });
  describe('LOAD_PAGE_ITEMS_SUCCESS action', () => {
    it('should update the state.pages', () => {
      const pageId = 'something';
      const action = new LoadPageItems(pageId);

      const completion = new LoadPageItemsSuccess({payload: {}, pageId });
      const state = reducer(initialState, action);
      // console.log('state.pages', state.pages)
      expect(state.pages).toEqual({});
    });
  });

  describe('SUBMIT_FORM_DATA_FAIL action', () => {
    it('should update the state.errorMessage', () => {

      const payload = {error: 'Undefined error', status: '500'};
      const action = new SubmitFormDataFail(payload);

      const state = reducer(initialState, action);
      expect(state.errorMessage).toEqual('Sorry, there is a problem with the service. Try again later');
    });
  });

  describe('RESET_ERROR_MESSAGE action', () => {
    it('should reset error message to empty string', () => {
      const action = new ResetErrorMessage({});
      const state = reducer(initialState, action);
      expect(state.errorMessage).toEqual('');
    });
  });
});
