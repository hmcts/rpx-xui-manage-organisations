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
      const formErrorMessages = action.payload
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

