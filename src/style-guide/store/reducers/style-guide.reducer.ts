import * as fromStyleGuide from '../actions/style-guide.actions';

export interface StyleGuideState {
  styleGuideFormData: object;
  styleGuideMessages: object;
  isFormValid: boolean;
}

export const initialState: StyleGuideState = {
  styleGuideFormData: {},
  styleGuideMessages: {},
  isFormValid: true
};

export function reducer(
  state = initialState,
  action: fromStyleGuide.StyleGuideActions
): StyleGuideState {
  if (action.type === fromStyleGuide.UPDATE_ERROR_MESSAGES) {
    const formErrorMessagesPayload = action.payload.errorMessages;
    const formErrorIsInvalid = action.payload.isInvalid;

    const formErrorMessages = Object.keys(formErrorIsInvalid).reduce((acc, key) => {
      const objArr = (k: string): any[] =>
        formErrorIsInvalid[k].map((item, i) =>
          item ? formErrorMessagesPayload[k][i] : ''
        );

      const isInvalid = objArr(key).filter((item) => item.length);

      acc[key] = {
        messages: objArr(key),
        isInvalid: isInvalid.length > 0
      };

      return acc;
    }, {});

    const isFormValid = !Object.keys(formErrorMessages)
      .some((key) => formErrorMessages[key].isInvalid);

    return {
      ...state,
      styleGuideMessages: formErrorMessages,
      isFormValid
    };
  }

  return state;
}

export const getInviteUserData = (state: StyleGuideState) => state.styleGuideFormData;
export const getInviteUserErrorMessage = (state: StyleGuideState) => state.styleGuideMessages;
export const getStyleGuideIsFormValid = (state: StyleGuideState) => state.isFormValid;
