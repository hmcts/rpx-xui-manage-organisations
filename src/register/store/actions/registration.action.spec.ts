import * as fromRegistration from './registration.actions';

describe('Registration actions', () => {
  describe('LoadPageItems actions GROUP', () => {
    // Init state
    describe('LoadPageItems', () => {
      it('should create an action', () => {
        const payload = 'A123';
        const action = new fromRegistration.LoadPageItems('A123');
        expect({ ...action }).toEqual({
          type: fromRegistration.LOAD_PAGE_ITEMS,
          payload
        });
      });
    });
    // Success
    describe('LoadPageItemsSuccess', () => {
      it('should create an action', () => {
        const payload = { payload: 'something', pageId: 'someString' };
        const action = new fromRegistration.LoadPageItemsSuccess({ payload: 'something', pageId: 'someString' });
        expect({ ...action }).toEqual({
          type: fromRegistration.LOAD_PAGE_ITEMS_SUCCESS,
          payload
        });
      });
    });
    // Fail
    describe('LoadPageItemsFail', () => {
      it('should create an action', () => {
        // Action is not been used. Should be passing error handler or error friendly string.
        const action = new fromRegistration.LoadPageItemsFail('Something');
        const payload = 'Something';
        expect({ ...action }).toEqual({
          type: fromRegistration.LOAD_PAGE_ITEMS_FAIL,
          payload
        });
      });
    });
  });

  // Fail
  describe('SubmitFormDataFail', () => {
    it('should create an action', () => {
      const action = new fromRegistration.SubmitFormDataFail('Error');
      const payload = 'Error';
      expect({ ...action }).toEqual({
        type: fromRegistration.SUBMIT_FORM_DATA_FAIL,
        payload
      });
    });
  });
});
