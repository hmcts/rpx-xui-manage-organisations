import { test } from './fixtures';
import { expectStatus } from './utils/assertions';

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
  test('rejects anonymous organisation user requests', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get('api/organisation/users');

    expectStatus(response.status, [401, 403]);
  });

  test('rejects anonymous user details lookup requests', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get('api/user-details?userId=anonymous-user-id');

    expectStatus(response.status, [401, 403]);
  });

  test('rejects anonymous edit-permissions requests before payload processing', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.put('api/editUserPermissions/users/anonymous-user-id', {
      data: editPermissionsPayload
    });

    expectStatus(response.status, [401, 403]);
  });

  test('rejects anonymous suspend-user requests before payload processing', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.put('api/user/anonymous-user-id/suspend', {
      data: suspendPayload
    });

    expectStatus(response.status, [401, 403]);
  });

  test('rejects anonymous CAA case-type search requests before downstream calls', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.post('api/caaCaseTypes', {
      data: {
        caaCasesPageType: 'AssignedCases',
        caaCasesFilterType: 'CaseName',
        caaCasesFilterValue: ''
      }
    });

    expectStatus(response.status, [401, 403]);
  });

  test('rejects anonymous CAA case search requests before downstream calls', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.post('api/caaCases?caseTypeId=CIVIL&pageNo=1&pageSize=25', {
      data: {
        caaCasesPageType: 'AssignedCases',
        caaCasesFilterType: 'CaseName',
        caaCasesFilterValue: ''
      }
    });

    expectStatus(response.status, [401, 403]);
  });

  test('rejects anonymous case-share user requests', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get('api/caseshare/users');

    expectStatus(response.status, [401, 403]);
  });

  test('rejects anonymous case-share assignment requests before payload processing', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.post('api/caseshare/case-assignments', {
      data: {
        sharedCases: []
      }
    });

    expectStatus(response.status, [401, 403]);
  });

  test('rejects anonymous PBA update requests before payload processing', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.post('api/pba/addPBA', {
      data: pbaPayload
    });

    expectStatus(response.status, [401, 403]);
  });

  test('rejects anonymous PBA delete requests before payload processing', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.delete('api/pba/deletePBA', {
      data: pbaPayload
    });

    expectStatus(response.status, [401, 403]);
  });
});
