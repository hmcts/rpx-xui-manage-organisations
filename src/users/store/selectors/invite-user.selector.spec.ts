import * as fromInviteUserReducer from '../reducers/invite-user.reducer';
import * as fromInviteSelectors from './invite-user.selector';

describe('Invite user selectors', () => {
  const inviteState: fromInviteUserReducer.InviteUserState = {
    ...fromInviteUserReducer.initialState,
    errorMessages: {
      firstName: { messages: ['Enter first name', ''] },
      email: { messages: ['Enter email'] }
    },
    isFormValid: false,
    errorHeader: 'There is a problem',
    isUserConfirmed: true,
    invitedUserEmail: 'person@example.com'
  };

  it('should return invite-user state or the initial state fallback', () => {
    expect(fromInviteSelectors.getInviteUserState.projector({ inviteUser: inviteState } as any)).toEqual(inviteState);
    expect(fromInviteSelectors.getInviteUserState.projector(null as any)).toEqual(fromInviteUserReducer.initialState);
  });

  it('should derive invite-user fields', () => {
    expect(fromInviteSelectors.getInviteUserErrorMessage.projector(inviteState)).toEqual(inviteState.errorMessages);
    expect(fromInviteSelectors.getInviteUserIsFormValid.projector(inviteState)).toBeFalse();
    expect(fromInviteSelectors.getInviteUserErrorHeader.projector(inviteState)).toEqual('There is a problem');
    expect(fromInviteSelectors.getInviteUserIsUserConfirmed.projector(inviteState)).toBeTrue();
    expect(fromInviteSelectors.getInviteUserEmail.projector(inviteState)).toEqual('person@example.com');
  });

  it('should format invite-user errors for display', () => {
    expect(fromInviteSelectors.getGetInviteUserErrorsArray.projector(
      inviteState.errorMessages,
      inviteState.isFormValid,
      inviteState.errorHeader
    )).toEqual({
      isFromValid: false,
      header: 'There is a problem',
      items: [
        { id: 'firstName', message: ['Enter first name'] },
        { id: 'email', message: ['Enter email'] }
      ]
    });
  });
});
