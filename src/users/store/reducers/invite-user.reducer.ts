import * as fromInviteUsers from '../actions/invite-user.actions';


export interface InviteUserState {
  inviteUserFormData: object;
  formErrorMessages: object;
}

export const initialState: InviteUserState = {
  inviteUserFormData: {},
  formErrorMessages: {}
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
        const arr = (k) => {
          return formErrorIsInvalid[k].map((item, i) => {
            if (item) {
              return formErrorMessagesPayload[k][i];
            }
          });
        }
        acc[key] = formErrorIsInvalid[key] ? arr(key) : '';
        return acc;
        }, []);
      return {
        ...state,
        formErrorMessages
      }
    }

  }

  return state;
}

export const getInviteUserData = (state: InviteUserState) => state.inviteUserFormData;
export const getInviteUserErrorMessage = (state: InviteUserState) => state.formErrorMessages;

