export type ProtectedRouteCoverageType = 'guardrail-test' | 'covered-by-suite' | 'documented-exclusion';

export interface ProtectedRouteInventoryEntry {
  route: string;
  coverageType: ProtectedRouteCoverageType;
  evidence: string;
  coverageFile?: string;
}

export interface ExternalRouteExclusion {
  route: string;
  reason: string;
}

export const protectedRouteInventory: ProtectedRouteInventoryEntry[] = [
  {
    route: '/accounts',
    coverageType: 'documented-exclusion',
    evidence: 'Fee-account lookup guardrail coverage is intentionally outside this PBA-management branch.'
  },
  {
    route: '/allUserList',
    coverageType: 'documented-exclusion',
    evidence: 'Role-expanded full user-list guardrail coverage is intentionally outside this PBA-management/API-integrity slice.'
  },
  {
    route: '/allUserListWithoutRoles',
    coverageType: 'guardrail-test',
    evidence: 'rejects anonymous full user list requests',
    coverageFile: 'playwright_tests_new/api/user-list.api.ts'
  },
  {
    route: '/caaCases',
    coverageType: 'guardrail-test',
    evidence: 'rejects anonymous CAA case search requests before downstream calls',
    coverageFile: 'playwright_tests_new/api/guard-rails.api.ts'
  },
  {
    route: '/caaCaseTypes',
    coverageType: 'guardrail-test',
    evidence: 'rejects anonymous CAA case-type search requests before downstream calls',
    coverageFile: 'playwright_tests_new/api/guard-rails.api.ts'
  },
  {
    route: '/caseshare',
    coverageType: 'guardrail-test',
    evidence: 'rejects anonymous case-share assignment requests before payload processing',
    coverageFile: 'playwright_tests_new/api/guard-rails.api.ts'
  },
  {
    route: '/editUserPermissions/users/:userId',
    coverageType: 'guardrail-test',
    evidence: 'rejects anonymous edit-permissions requests before payload processing',
    coverageFile: 'playwright_tests_new/api/guard-rails.api.ts'
  },
  {
    route: '/healthCheck',
    coverageType: 'documented-exclusion',
    evidence: 'Health check is intentionally also registered before authentication for operational readiness.'
  },
  {
    route: '/inviteUser',
    coverageType: 'covered-by-suite',
    evidence: 'Authenticated invite and re-invite API contract coverage.',
    coverageFile: 'playwright_tests_new/api/invite-user.api.ts'
  },
  {
    route: '/jurisdictions',
    coverageType: 'covered-by-suite',
    evidence: 'Authenticated jurisdiction reference-data API coverage.',
    coverageFile: 'playwright_tests_new/api/reference-data.api.ts'
  },
  {
    route: '/organisation',
    coverageType: 'guardrail-test',
    evidence: 'rejects anonymous organisation user requests',
    coverageFile: 'playwright_tests_new/api/guard-rails.api.ts'
  },
  {
    route: '/organisationTypes',
    coverageType: 'covered-by-suite',
    evidence: 'Authenticated organisation-type reference-data API coverage.',
    coverageFile: 'playwright_tests_new/api/reference-data.api.ts'
  },
  {
    route: '/ogd-flow',
    coverageType: 'documented-exclusion',
    evidence: 'OGD invite/update orchestration guardrail coverage is intentionally outside this PBA-management/API-integrity slice.'
  },
  {
    route: '/payments/:account',
    coverageType: 'documented-exclusion',
    evidence: 'Payment-history lookup guardrail coverage is intentionally outside this PBA-management/API-integrity slice.'
  },
  {
    route: '/pba',
    coverageType: 'guardrail-test',
    evidence: 'rejects anonymous PBA add-delete requests before payload processing',
    coverageFile: 'playwright_tests_new/api/guard-rails.api.ts'
  },
  {
    route: '/register-org',
    coverageType: 'covered-by-suite',
    evidence: 'Authenticated registration API contract coverage.',
    coverageFile: 'playwright_tests_new/api/register-organisation.api.ts'
  },
  {
    route: '/refresh-user',
    coverageType: 'documented-exclusion',
    evidence: 'Role-mapping refresh guardrail coverage is intentionally outside this PBA-management/API-integrity slice.'
  },
  {
    route: '/retrieve-access-types',
    coverageType: 'documented-exclusion',
    evidence: 'Access-type retrieval guardrail coverage is intentionally outside this PBA-management/API-integrity slice.'
  },
  {
    route: '/termsAndConditions',
    coverageType: 'covered-by-suite',
    evidence: 'Terms and conditions API contract coverage.',
    coverageFile: 'playwright_tests_new/api/terms-and-conditions.api.ts'
  },
  {
    route: '/user',
    coverageType: 'covered-by-suite',
    evidence: 'Authenticated user session API shape coverage.',
    coverageFile: 'playwright_tests_new/api/user-session.api.ts'
  },
  {
    route: '/user-details',
    coverageType: 'guardrail-test',
    evidence: 'rejects anonymous user details lookup requests',
    coverageFile: 'playwright_tests_new/api/guard-rails.api.ts'
  },
  {
    route: '/user/:userId/suspend',
    coverageType: 'guardrail-test',
    evidence: 'rejects anonymous suspend-user requests before payload processing',
    coverageFile: 'playwright_tests_new/api/guard-rails.api.ts'
  },
  {
    route: '/userDetails',
    coverageType: 'covered-by-suite',
    evidence: 'UserDetails-backed user-list API contract coverage.',
    coverageFile: 'playwright_tests_new/api/user-list.api.ts'
  },
  {
    route: '/userList',
    coverageType: 'guardrail-test',
    evidence: 'rejects anonymous paged user list requests',
    coverageFile: 'playwright_tests_new/api/user-list.api.ts'
  },
  {
    route: '/userTermsAndConditions',
    coverageType: 'covered-by-suite',
    evidence: 'User terms update API contract coverage.',
    coverageFile: 'playwright_tests_new/api/terms-and-conditions.api.ts'
  },
  {
    route: '/userTermsAndConditions/:userId',
    coverageType: 'covered-by-suite',
    evidence: 'User terms lookup API contract coverage.',
    coverageFile: 'playwright_tests_new/api/terms-and-conditions.api.ts'
  }
];

export const externalRouteExclusions: ExternalRouteExclusion[] = [
  {
    route: '/addresses',
    reason: 'Address lookup is an unauthenticated external reference-data route used before organisation registration completes.'
  },
  {
    route: '/configuration-ui',
    reason: 'UI runtime configuration is intentionally served under /external before API authentication is attached.'
  },
  {
    route: '/getLovRefData',
    reason: 'Reference-data lookup is intentionally exposed under /external for registration flows.'
  },
  {
    route: '/monitoring-tools',
    reason: 'Application Insights connection-string route is intentionally registered under /external.'
  },
  {
    route: '/register-org',
    reason: 'Legacy registration submission remains on /external/register-org by design while authenticated API registration is separate.'
  },
  {
    route: '/register-org-new',
    reason: 'New registration submission remains on /external/register-org-new by design while authenticated API registration is separate.'
  },
  {
    route: '/regulatoryOrganisationTypes',
    reason: 'Organisation type reference-data lookup is intentionally exposed under /external for registration flows.'
  }
];
