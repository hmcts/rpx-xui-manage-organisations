import * as fromStyleGuide from './style-guide.reducer';
import * as fromStyleGuideActions from '../actions/style-guide.actions';


describe('AppReducer', () => {
    it('undefined action should return the default state', () => {
      const { initialState } = fromStyleGuide;
      const action = {} as any;
      const state = fromStyleGuide.reducer(undefined, action);

      expect(state).toBe(initialState);
    });

    it('UPDATE_ERROR_MESSAGES action should return correct state', () => {
      const { initialState } = fromStyleGuide;

      const action = new fromStyleGuideActions.UpdateErrorMessages({
        isInvalid: [[{}]],
        errorMessages: [[{}]]
      });
      const state = fromStyleGuide.reducer(initialState, action);

      expect(state.isFormValid).toEqual(true);
      expect(state.styleGuideFormData).toEqual({});
      expect(state.styleGuideMessages).toEqual({ messages: [ {  } ], isInvalid: false });
    });


});
