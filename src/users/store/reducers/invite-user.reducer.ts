import { errorMessageMappings } from 'src/register/mappings/apiErrorMappings';
import * as fromInviteUsers from '../actions/invite-user.actions';


export interface InviteUserState {
  inviteUserFormData: object;
  errorMessages: object;
  isFormValid: boolean;
  errorHeader: string;
  isUserConfirmed: boolean;
  invitedUserEmail: string;
}

export const initialState: InviteUserState = {
  inviteUserFormData: {},
  errorMessages: {},
  isFormValid: true,
  errorHeader: '',
  isUserConfirmed: false,
  invitedUserEmail: ''
};

export function reducer(
  state = initialState,
  action: fromInviteUsers.InviteUserActions
): InviteUserState {
  switch (action.type) {
    case fromInviteUsers.UPDATE_ERROR_MESSAGES: {
      const errorMessagesPayload = action.payload.errorMessages;
      const formErrorIsInvalid = action.payload.isInvalid;

      const errorMessages = Object.keys(formErrorIsInvalid).reduce((acc, key) => {

        const objArr = (k): any[] => {
          return formErrorIsInvalid[k].map((item, i) => {
              return item ? errorMessagesPayload[k][i] : '';
          });
        };

        const isInvalid = objArr(key).filter(item => item.length);

        acc[key] = {
          messages: objArr(key),
          isInvalid: !!isInvalid.length
        };

        return acc;

        }, {});
      const isFormValid = !Object.keys(errorMessages)
        .filter(key => errorMessages[key].isInvalid).length;

      return {
        ...state,
        errorMessages,
        isFormValid,
        errorHeader: 'There is a problem'
      };
    }

    case fromInviteUsers.INVITE_USER_FAIL: {
      const errorMessages = {
        serverResponse: {
          messages: [
            action.payload.error.apiStatusCode === 409 && errorMessageMappings ? errorMessageMappings[1] :  action.payload.error.message
          ]
        }
      };
      return {
        ...state,
        errorMessages,
        isFormValid: false,
        errorHeader: 'Sorry, there is a problem with the service.'
      };
    }

    case fromInviteUsers.INVITE_USER_SUCCESS: {
      return {
        ...state,
        isUserConfirmed: true,
        invitedUserEmail: action.payload.userEmail
      };
    }

    case fromInviteUsers.RESET: {
      return {
        ...initialState
      };
    }

    default:
      return state;
  }
}

export const getInviteUserData = (state: InviteUserState) => state.inviteUserFormData;
export const getInviteUserErrorMessage = (state: InviteUserState) => state.errorMessages;
export const getInviteUserIsFormValid = (state: InviteUserState) => state.isFormValid;
export const getInviteUserErrorHeader = (state: InviteUserState) => state.errorHeader;
export const getInviteUserIsUserConfirmed = (state: InviteUserState) => state.isUserConfirmed;
export const getInviteUserEmail = (state: InviteUserState) => state.invitedUserEmail;
