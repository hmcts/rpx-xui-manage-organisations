import { expect, test } from '@playwright/test';
import { createLogger } from '@hmcts/playwright-common';
import type { ApiLogEntry } from '@hmcts/playwright-common';

import { __test__ as apiFixturesTest } from '../fixtures';

const syntheticEmail = 'manage-org-redaction-user@example.test';
const syntheticUserId = '11111111-2222-4333-8444-555555555555';
const syntheticOrgId = 'ORG-REDACT-1';
const syntheticForename = 'Redaction';
const syntheticSurname = 'Fixture';
const syntheticDisplayName = `${syntheticForename} ${syntheticSurname}`;
const syntheticCookie = 'xui-mo-webapp=synthetic-cookie-value; XSRF-TOKEN=synthetic-xsrf-value';
const syntheticToken = 'Bearer synthetic-token-value';
const redactedValue = '[REDACTED]';

test.describe('Manage Org API logging safety', { tag: '@svc-internal' }, () => {
  test('redacts identity, session and auth values from API log entries before they are attached', () => {
    const apiLogEntry: ApiLogEntry = {
      id: 'api-log-id',
      name: 'manage-org-node-api-authenticated',
      method: 'GET',
      url: `https://manage-org.aat.platform.hmcts.net/api/user/details?userId=${syntheticUserId}&email=${syntheticEmail}`,
      status: 200,
      ok: true,
      timestamp: new Date(0).toISOString(),
      durationMs: 10,
      correlationId: syntheticUserId,
      request: {
        headers: {
          Authorization: syntheticToken,
          Cookie: syntheticCookie
        }
      },
      response: {
        headers: {
          'set-cookie': syntheticCookie
        },
        body: {
          displayName: syntheticDisplayName,
          email: syntheticEmail,
          firstName: syntheticForename,
          forename: syntheticForename,
          fullName: syntheticDisplayName,
          id: syntheticUserId,
          lastName: syntheticSurname,
          organisationIdentifier: syntheticOrgId,
          orgId: syntheticOrgId,
          roles: ['pui-organisation-manager'],
          sessionTimeout: {
            idleModalDisplayTime: 10
          },
          surname: syntheticSurname,
          userName: syntheticEmail
        }
      },
      rawRequest: {
        data: {
          email: syntheticEmail,
          password: 'synthetic-password'
        }
      },
      rawResponse: JSON.stringify({
        displayName: syntheticDisplayName,
        email: syntheticEmail,
        firstName: syntheticForename,
        fullName: syntheticDisplayName,
        orgId: syntheticOrgId,
        surname: syntheticSurname,
        userId: syntheticUserId
      })
    };

    const sanitizedLog = apiFixturesTest.sanitizeApiLogEntry(apiLogEntry);
    const serializedLog = JSON.stringify(sanitizedLog);

    expect(serializedLog).not.toContain(syntheticEmail);
    expect(serializedLog).not.toContain(syntheticUserId);
    expect(serializedLog).not.toContain(syntheticOrgId);
    expect(serializedLog).not.toContain(syntheticForename);
    expect(serializedLog).not.toContain(syntheticSurname);
    expect(serializedLog).not.toContain(syntheticDisplayName);
    expect(serializedLog).not.toContain(syntheticCookie);
    expect(serializedLog).not.toContain(syntheticToken);
    expect(serializedLog).not.toContain('synthetic-password');
    expect(serializedLog).toContain(redactedValue);
  });

  test('redacts ApiClient console log metadata before delegating to the base logger', () => {
    const baseLogger = createLogger({
      serviceName: 'manage-org-api-logging-unit',
      format: 'pretty'
    });
    const apiClientLogger = apiFixturesTest.createSanitizedApiClientLogger(baseLogger);
    const emittedMessages: unknown[] = [];

    baseLogger.log = ((message: unknown) => {
      emittedMessages.push(message);
      return baseLogger;
    }) as typeof baseLogger.log;

    apiClientLogger.log({
      level: 'info',
      message: `GET /api/user/details?userId=${syntheticUserId} -> 200`,
      apiCall: {
        request: {
          headers: {
            Authorization: syntheticToken,
            Cookie: syntheticCookie
          }
        },
        response: {
          body: {
            email: syntheticEmail,
            forename: syntheticForename,
            surname: syntheticSurname,
            orgId: syntheticOrgId,
            userId: syntheticUserId
          }
        }
      }
    });

    const serializedMessages = JSON.stringify(emittedMessages);

    expect(serializedMessages).not.toContain(syntheticEmail);
    expect(serializedMessages).not.toContain(syntheticUserId);
    expect(serializedMessages).not.toContain(syntheticOrgId);
    expect(serializedMessages).not.toContain(syntheticForename);
    expect(serializedMessages).not.toContain(syntheticSurname);
    expect(serializedMessages).not.toContain(syntheticCookie);
    expect(serializedMessages).not.toContain(syntheticToken);
    expect(serializedMessages).not.toContain('response');
    expect(serializedMessages).not.toContain('request');
    expect(serializedMessages).toContain(redactedValue);
  });
});
