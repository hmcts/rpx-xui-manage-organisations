import {initialState, reducer} from './registration.reducer';
import {LoadPageItems} from '../actions/registration.actions';
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
});
