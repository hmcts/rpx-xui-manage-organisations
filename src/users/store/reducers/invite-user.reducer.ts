import * as fromInviteUsers from '../actions/invite-user.actions';


export interface InviteUserState {
  inviteUserFormData: object;
  formErrorMessages: object;
  isFormValid: boolean;
}

export const initialState: InviteUserState = {
  inviteUserFormData: {},
  formErrorMessages: {},
  isFormValid: true
};

export function reducer(
  state = initialState,
  action: fromInviteUsers.InviteUserActions
): InviteUserState {
  switch (action.type) {
    case fromInviteUsers.UPDATE_ERROR_MESSAGES: {
      const formErrorMessagesPayload = action.payload.errorMessages;
      const formErrorIsInvalid = action.payload.isInvalid;

      const formErrorMessages = Object.keys(formErrorIsInvalid).reduce((acc, key) => {

        const objArr = (k): any[] => {
          return formErrorIsInvalid[k].map((item, i) => {
              return item ? formErrorMessagesPayload[k][i] : '';
          });
        };

        const isInvalid = objArr(key).filter(item => item.length);

        acc[key] = {
          messages: objArr(key),
          isInvalid: !!isInvalid.length
        }

        return acc;

        }, {});
      const isFormValid = !Object.keys(formErrorMessages)
        .filter(key => formErrorMessages[key].isInvalid).length;

      return {
        ...state,
        formErrorMessages,
        isFormValid
      }
    }

  }

  return state;
}

export const getInviteUserData = (state: InviteUserState) => state.inviteUserFormData;
export const getInviteUserErrorMessage = (state: InviteUserState) => state.formErrorMessages;
export const getInviteUserIsFormValid = (state: InviteUserState) => state.isFormValid;

