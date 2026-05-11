import { test, expect } from './fixtures';

const editPermissionsPayload = {
  firstName: 'Anonymous',
  lastName: 'User',
  roles: ['pui-user-manager']
};

const suspendPayload = {
  firstName: 'Anonymous',
  lastName: 'User',
  roles: []
};

const pbaPayload = {
  organisationId: 'anonymous-org',
  pbaNumber: 'PBA0000000'
};

test.describe('Protected API guard rail contracts', { tag: '@svc-auth-guards' }, () => {
  test('rejects anonymous organisation user requests', async ({ anonymousClient }) => {
    const response = await anonymousClient.get('api/organisation/users');

    expect([401, 403], 'Anonymous organisation user requests should be rejected').toContain(response.status);
  });

  test('rejects anonymous user details lookup requests', async ({ anonymousClient }) => {
    const response = await anonymousClient.get('api/user-details?userId=anonymous-user-id');

    expect([401, 403], 'Anonymous user details lookup requests should be rejected').toContain(response.status);
  });

  test('rejects anonymous edit-permissions requests before payload processing', async ({ anonymousClient }) => {
    const response = await anonymousClient.put('api/editUserPermissions/users/anonymous-user-id', {
      data: editPermissionsPayload
    });

    expect([401, 403], 'Anonymous edit-permissions requests should be rejected').toContain(response.status);
  });

  test('rejects anonymous suspend-user requests before payload processing', async ({ anonymousClient }) => {
    const response = await anonymousClient.put('api/user/anonymous-user-id/suspend', {
      data: suspendPayload
    });

    expect([401, 403], 'Anonymous suspend-user requests should be rejected').toContain(response.status);
  });

  test('rejects anonymous CAA case-type search requests before downstream calls', async ({ anonymousClient }) => {
    const response = await anonymousClient.post('api/caaCaseTypes', {
      data: {
        caaCasesPageType: 'AssignedCases',
        caaCasesFilterType: 'CaseName',
        caaCasesFilterValue: ''
      }
    });

    expect([401, 403], 'Anonymous CAA case-type search requests should be rejected').toContain(response.status);
  });

  test('rejects anonymous CAA case search requests before downstream calls', async ({ anonymousClient }) => {
    const response = await anonymousClient.post('api/caaCases?caseTypeId=CIVIL&pageNo=1&pageSize=25', {
      data: {
        caaCasesPageType: 'AssignedCases',
        caaCasesFilterType: 'CaseName',
        caaCasesFilterValue: ''
      }
    });

    expect([401, 403], 'Anonymous CAA case search requests should be rejected').toContain(response.status);
  });

  test('rejects anonymous case-share user requests', async ({ anonymousClient }) => {
    const response = await anonymousClient.get('api/caseshare/users');

    expect([401, 403], 'Anonymous case-share user requests should be rejected').toContain(response.status);
  });

  test('rejects anonymous case-share assignment requests before payload processing', async ({ anonymousClient }) => {
    const response = await anonymousClient.post('api/caseshare/case-assignments', {
      data: {
        sharedCases: []
      }
    });

    expect([401, 403], 'Anonymous case-share assignment requests should be rejected').toContain(response.status);
  });

  test('rejects anonymous PBA update requests before payload processing', async ({ anonymousClient }) => {
    const response = await anonymousClient.post('api/pba/addPBA', {
      data: pbaPayload
    });

    expect([401, 403], 'Anonymous PBA update requests should be rejected').toContain(response.status);
  });

  test('rejects anonymous PBA delete requests before payload processing', async ({ anonymousClient }) => {
    const response = await anonymousClient.delete('api/pba/deletePBA', {
      data: pbaPayload
    });

    expect([401, 403], 'Anonymous PBA delete requests should be rejected').toContain(response.status);
  });
});
