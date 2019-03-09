import * as fromInviteUsers from '../actions/invite-user.actions';


export interface InviteUserState {
  inviteUserFormData: object;
  formErrorMessages: {[id: string]: string};
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

      const formErrorMessages = Object.keys(formErrorMessagesPayload).reduce((acc, key) => {
        acc[key] = formErrorIsInvalid[key] ? formErrorMessagesPayload[key] : '';
        return acc;
        }, {});

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

