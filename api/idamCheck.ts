import { getConfigValue } from './configuration';
import { SERVICES_IDAM_API_PATH } from './configuration/references';
import axios from 'axios';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRetryConfig() {
  const maxWaitMs = Number(process.env.IDAM_STARTUP_MAX_WAIT_MS || 120000);
  const retryIntervalMs = Number(process.env.IDAM_STARTUP_RETRY_INTERVAL_MS || 5000);
  const requestTimeoutMs = Number(process.env.IDAM_STARTUP_REQUEST_TIMEOUT_MS || 5000);
  return {
    maxWaitMs: Number.isFinite(maxWaitMs) && maxWaitMs > 0 ? maxWaitMs : 120000,
    retryIntervalMs: Number.isFinite(retryIntervalMs) && retryIntervalMs > 0 ? retryIntervalMs : 5000,
    requestTimeoutMs: Number.isFinite(requestTimeoutMs) && requestTimeoutMs > 0 ? requestTimeoutMs : 5000
  };
}

export const idamCheck = async (resolve, reject) => {
  const { maxWaitMs, retryIntervalMs, requestTimeoutMs } = getRetryConfig();
  const idamApiUrl = String(getConfigValue(SERVICES_IDAM_API_PATH) || '').replace(/\/$/, '');
  const idamOidcDiscoveryUrl = `${idamApiUrl}/o/.well-known/openid-configuration`;

  const start = Date.now();
  let attempt = 0;

  while (Date.now() - start < maxWaitMs) {
    attempt += 1;
    try {
      // Startup gating uses OIDC discovery, but we call it with plain axios (no interceptors)
      // to avoid dumping large HTML bodies in logs on 502s.
      const res = await axios.get(idamOidcDiscoveryUrl, {
        timeout: requestTimeoutMs,
        validateStatus: () => true
      });

      if (res.status >= 200 && res.status < 300) {
        resolve();
        return;
      }

      const elapsed = Date.now() - start;
      console.warn(
        `IDAM OIDC discovery not ready (attempt ${attempt}, ${elapsed}ms elapsed) - status ${res.status}. ` +
        `Retrying in ${retryIntervalMs}ms...`
      );
    } catch (err: any) {
      const elapsed = Date.now() - start;
      console.warn(
        `IDAM OIDC discovery failed (attempt ${attempt}, ${elapsed}ms elapsed)` +
        `${err?.message ? ` - ${err.message}` : ''}. Retrying in ${retryIntervalMs}ms...`
      );
    }

    await sleep(retryIntervalMs);
  }

  console.error(`idam api must be up to start (timed out after ${maxWaitMs}ms): ${idamOidcDiscoveryUrl}`);
  process.exit(1);
  reject(new Error('IDAM startup check timed out'));
};
