import { test, expect } from './fixtures';
import type { CaseShareUser } from './utils/types';

test.describe('Case sharing API contracts', { tag: '@svc-case-sharing' }, () => {
  test('returns active case-share users with mapped IDAM identity fields', async ({ apiClient }) => {
    const response = await apiClient.get<CaseShareUser[]>('api/caseshare/users');
    const users = response.data;
    const identifiableUser = users.find((user) => user.email && user.firstName && user.idamId && user.lastName);

    expect(response.status, 'Case-share users should be returned for an authenticated user').toBe(200);
    expect(users, 'Case-share users response should be an array').toEqual(expect.any(Array));
    expect(users.length, 'At least one active user should be available for case sharing').toBeGreaterThan(0);
    expect(identifiableUser, 'At least one case-share user should include mapped identity fields').toEqual(
      expect.objectContaining({
        email: expect.stringMatching(/^[^@\s]+@[^@\s]+\.[^@\s]+$/),
        firstName: expect.any(String),
        idamId: expect.any(String),
        lastName: expect.any(String)
      })
    );
    expect(identifiableUser?.firstName, 'Mapped case-share user first name should not be empty').not.toHaveLength(0);
    expect(identifiableUser?.idamId, 'Mapped case-share user IDAM identifier should not be empty').not.toHaveLength(0);
    expect(identifiableUser?.lastName, 'Mapped case-share user last name should not be empty').not.toHaveLength(0);
  });
});
