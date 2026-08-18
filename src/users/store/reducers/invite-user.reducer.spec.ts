import * as inviteActions from '../actions/invite-user.actions';
import * as fromInviteUser from './invite-user.reducer';

describe('InviteUserReducer', () => {
  it('should return the initial state for an unknown action', () => {
    const state = fromInviteUser.reducer(undefined, {} as any);

    expect(state).toBe(fromInviteUser.initialState);
  });

  it('should update validation error messages and mark the form invalid', () => {
    const action = new inviteActions.UpdateErrorMessages({
      isInvalid: {
        firstName: [true],
        lastName: [false],
        email: [true],
        roles: [false]
      },
      errorMessages: {
        firstName: ['Enter first name'],
        lastName: ['Enter last name'],
        email: ['Enter a valid email address'],
        roles: ['You must select at least one action']
      }
    });

    const state = fromInviteUser.reducer(fromInviteUser.initialState, action);

    expect(state.isFormValid).toBeFalse();
    expect(state.errorHeader).toEqual('There is a problem');
    expect(state.errorMessages).toEqual({
      firstName: { messages: ['Enter first name'], isInvalid: true },
      email: { messages: ['Enter a valid email address'], isInvalid: true }
    });
  });

  it('should handle invite failure variants', () => {
    expect(fromInviteUser.reducer(fromInviteUser.initialState, new inviteActions.InviteUserFailWith400({})).errorHeader)
      .toEqual('Sorry, there is a problem');
    expect(fromInviteUser.reducer(fromInviteUser.initialState, new inviteActions.InviteUserFailWith404({})).errorHeader)
      .toEqual('Sorry, there is a problem with this account');
    expect(fromInviteUser.reducer(fromInviteUser.initialState, new inviteActions.InviteUserFailWith409({})).errorMessages)
      .toEqual({
        serverResponse1: { messages: ['Sorry, there is a problem with the service.'] },
        serverResponse2: { messages: ['A user with this email address already exists'] }
      });
    expect(fromInviteUser.reducer(fromInviteUser.initialState, new inviteActions.InviteUserFailWith429({})).errorMessages)
      .toEqual({
        serverResponse1: { messages: ['This user has already been invited in the last hour'] },
        serverResponse2: { messages: ['The recipient will receive an email from HM Courts and Tribunals Registrations so they can finish setting up their account'] }
      });
  });

  it('should use mapped duplicate-user message for generic 409 failure', () => {
    const state = fromInviteUser.reducer(
      fromInviteUser.initialState,
      new inviteActions.InviteUserFail({ apiStatusCode: 409, error: { message: 'ignored' } })
    );

    expect(state.isFormValid).toBeFalse();
    expect(state.errorMessages.serverResponse.messages.length).toBeGreaterThan(0);
  });

  it('should use API message for non-409 generic failure', () => {
    const state = fromInviteUser.reducer(
      fromInviteUser.initialState,
      new inviteActions.InviteUserFail({ apiStatusCode: 500, error: { message: 'API down' } })
    );

    expect(state.errorMessages.serverResponse.messages).toEqual(['API down']);
  });

  it('should store invited user email on success and reset state', () => {
    const invitedState = fromInviteUser.reducer(
      fromInviteUser.initialState,
      new inviteActions.InviteUserSuccess({ userEmail: 'person@example.com' })
    );

    expect(invitedState.isUserConfirmed).toBeTrue();
    expect(invitedState.invitedUserEmail).toEqual('person@example.com');
    expect(fromInviteUser.reducer(invitedState, new inviteActions.Reset())).toEqual(fromInviteUser.initialState);
  });

  it('should expose invite user state through reducer helpers', () => {
    const state = {
      ...fromInviteUser.initialState,
      inviteUserFormData: { firstName: 'A' },
      errorMessages: { firstName: { messages: ['Enter first name'] } },
      isFormValid: false,
      errorHeader: 'There is a problem',
      isUserConfirmed: true,
      invitedUserEmail: 'person@example.com'
    };

    expect(fromInviteUser.getInviteUserData(state)).toEqual({ firstName: 'A' });
    expect(fromInviteUser.getInviteUserErrorMessage(state)).toEqual({ firstName: { messages: ['Enter first name'] } });
    expect(fromInviteUser.getInviteUserIsFormValid(state)).toBeFalse();
    expect(fromInviteUser.getInviteUserErrorHeader(state)).toEqual('There is a problem');
    expect(fromInviteUser.getInviteUserIsUserConfirmed(state)).toBeTrue();
    expect(fromInviteUser.getInviteUserEmail(state)).toEqual('person@example.com');
  });
});
