import * as actions from './invite-user.actions';

describe('Invite user actions', () => {
  it('should construct invite user actions', () => {
    const payload = { email: 'person@example.com' } as any;

    expect({ ...new actions.SendInviteUser(payload, ['ORG-1']) }).toEqual({
      type: actions.SEND_INVITE_USER,
      payload,
      orgProfileIds: ['ORG-1']
    });
    expect({ ...new actions.InviteUserSuccess(payload) }).toEqual({ type: actions.INVITE_USER_SUCCESS, payload });
    expect({ ...new actions.InviteUserFail(payload) }).toEqual({ type: actions.INVITE_USER_FAIL, payload });
    expect({ ...new actions.InviteUserFailWith400(payload) }).toEqual({ type: actions.INVITE_USER_FAIL_WITH_400, payload });
    expect({ ...new actions.InviteUserFailWith404(payload) }).toEqual({ type: actions.INVITE_USER_FAIL_WITH_404, payload });
    expect({ ...new actions.InviteUserFailWith409(payload) }).toEqual({ type: actions.INVITE_USER_FAIL_WITH_409, payload });
    expect({ ...new actions.InviteUserFailWith422(payload) }).toEqual({ type: actions.INVITE_USER_FAIL_WITH_422, payload });
    expect({ ...new actions.InviteUserFailWith429(payload) }).toEqual({ type: actions.INVITE_USER_FAIL_WITH_429, payload });
    expect({ ...new actions.InviteUserFailWith500(payload) }).toEqual({ type: actions.INVITE_USER_FAIL_WITH_500, payload });
    expect({ ...new actions.AddFromData(payload) }).toEqual({ type: actions.ADD_FORM_DATA, payload });
    expect({ ...new actions.UpdateErrorMessages(payload) }).toEqual({ type: actions.UPDATE_ERROR_MESSAGES, payload });
    expect({ ...new actions.Reset() }).toEqual({ type: actions.RESET });
  });
});
