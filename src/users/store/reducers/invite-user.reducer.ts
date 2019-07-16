import * as fromInviteUsers from '../actions/invite-user.actions';


export interface InviteUserState {
  inviteUserFormData: object;
  formErrorMessages: object;
  isFormValid: boolean;
  errorHeader: string;
}

export const initialState: InviteUserState = {
  inviteUserFormData: {},
  formErrorMessages: {},
  isFormValid: true,
  errorHeader: ''
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
        };

        return acc;

        }, {});
      const isFormValid = !Object.keys(formErrorMessages)
        .filter(key => formErrorMessages[key].isInvalid).length;

      return {
        ...state,
        formErrorMessages,
        isFormValid,
        errorHeader: 'There is a problem'
      };
    }

    case fromInviteUsers.INVITE_USER_FAIL: {
      const formErrorMessages = {
        serverResponse: {
          messages: [
            'Try again later.'
          ]
        }
      };
      return {
        ...state,
        formErrorMessages,
        isFormValid: false,
        errorHeader: 'Sorry, there is a problem with the service.'
      };
    }

  }

  return state;
}

export const getInviteUserData = (state: InviteUserState) => state.inviteUserFormData;
export const getInviteUserErrorMessage = (state: InviteUserState) => state.formErrorMessages;
export const getInviteUserIsFormValid = (state: InviteUserState) => state.isFormValid;
export const getInviteUserErrorHeader = (state: InviteUserState) => state.errorHeader;

