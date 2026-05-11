import { expect, test } from '@playwright/test';
import { createLogger } from '@hmcts/playwright-common';
import type { ApiLogEntry } from '@hmcts/playwright-common';

import { __test__ as apiFixturesTest } from '../fixtures';

const liveEmail = 'hmcts.civil+organisation.1.solicitor.1@gmail.com';
const liveUserId = '9c5e5972-842e-4eee-a002-a11111111111';
const liveOrgId = 'Q1KOKP2';
const liveForename = 'Aat';
const liveSurname = 'Solicitor';
const liveDisplayName = `${liveForename} ${liveSurname}`;
const liveCookie = 'xui-mo-webapp=live-cookie-value; XSRF-TOKEN=live-xsrf-value';
const liveToken = 'Bearer live-token-value';
const redactedValue = '[REDACTED]';

test.describe('Manage Org API logging safety', { tag: '@svc-internal' }, () => {
  test('redacts identity, session and auth values from API log entries before they are attached', () => {
    const apiLogEntry: ApiLogEntry = {
      id: 'api-log-id',
      name: 'manage-org-node-api-authenticated',
      method: 'GET',
      url: `https://manage-org.aat.platform.hmcts.net/api/user/details?userId=${liveUserId}&email=${liveEmail}`,
      status: 200,
      ok: true,
      timestamp: new Date(0).toISOString(),
      durationMs: 10,
      correlationId: liveUserId,
      request: {
        headers: {
          Authorization: liveToken,
          Cookie: liveCookie
        }
      },
      response: {
        headers: {
          'set-cookie': liveCookie
        },
        body: {
          displayName: liveDisplayName,
          email: liveEmail,
          firstName: liveForename,
          forename: liveForename,
          fullName: liveDisplayName,
          id: liveUserId,
          lastName: liveSurname,
          organisationIdentifier: liveOrgId,
          orgId: liveOrgId,
          roles: ['pui-organisation-manager'],
          sessionTimeout: {
            idleModalDisplayTime: 10
          },
          surname: liveSurname,
          userName: liveEmail
        }
      },
      rawRequest: {
        data: {
          email: liveEmail,
          password: 'live-password'
        }
      },
      rawResponse: JSON.stringify({
        displayName: liveDisplayName,
        email: liveEmail,
        firstName: liveForename,
        fullName: liveDisplayName,
        orgId: liveOrgId,
        surname: liveSurname,
        userId: liveUserId
      })
    };

    const sanitizedLog = apiFixturesTest.sanitizeApiLogEntry(apiLogEntry);
    const serializedLog = JSON.stringify(sanitizedLog);

    expect(serializedLog).not.toContain(liveEmail);
    expect(serializedLog).not.toContain(liveUserId);
    expect(serializedLog).not.toContain(liveOrgId);
    expect(serializedLog).not.toContain(liveForename);
    expect(serializedLog).not.toContain(liveSurname);
    expect(serializedLog).not.toContain(liveDisplayName);
    expect(serializedLog).not.toContain(liveCookie);
    expect(serializedLog).not.toContain(liveToken);
    expect(serializedLog).not.toContain('live-password');
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
      message: `GET /api/user/details?userId=${liveUserId} -> 200`,
      apiCall: {
        request: {
          headers: {
            Authorization: liveToken,
            Cookie: liveCookie
          }
        },
        response: {
          body: {
            email: liveEmail,
            forename: liveForename,
            surname: liveSurname,
            orgId: liveOrgId,
            userId: liveUserId
          }
        }
      }
    });

    const serializedMessages = JSON.stringify(emittedMessages);

    expect(serializedMessages).not.toContain(liveEmail);
    expect(serializedMessages).not.toContain(liveUserId);
    expect(serializedMessages).not.toContain(liveOrgId);
    expect(serializedMessages).not.toContain(liveForename);
    expect(serializedMessages).not.toContain(liveSurname);
    expect(serializedMessages).not.toContain(liveCookie);
    expect(serializedMessages).not.toContain(liveToken);
    expect(serializedMessages).not.toContain('response');
    expect(serializedMessages).not.toContain('request');
    expect(serializedMessages).toContain(redactedValue);
  });
});
