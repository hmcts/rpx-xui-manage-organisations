import { getConfigValue } from '../configuration';
import { MAX_LOG_LINE } from '../configuration/references';
import * as log4jui from './log4jui';
import { shorten, valueOrNull } from './util';

function getServiceName(hostname: string): string {
  return hostname
    .split('.')[0]
    .replace(/-(aat|demo|docker|ithc|ldocker|local|preview|prod|saat|spreview|sprod)$/i, '');
}

function formatServiceUrl(rawUrl: string): string {
  try {
    const parsedUrl = new URL(rawUrl);
    const path = `${parsedUrl.pathname}${parsedUrl.search}`;
    return `${getServiceName(parsedUrl.hostname)} ${shorten(path, getConfigValue(MAX_LOG_LINE))}`;
  } catch {
    return shorten(rawUrl, getConfigValue(MAX_LOG_LINE));
  }
}

export function requestInterceptor(request) {
  const logger = log4jui.getLogger('outgoing');

  logger.info(`${request.method.toUpperCase()} ${formatServiceUrl(request.url)}`);
  // add timings to requests
  request.metadata = { startTime: new Date() };
  return request;
}

export function successInterceptor(response) {
  response.config.metadata.endTime = new Date();
  response.duration = response.config.metadata.endTime - response.config.metadata.startTime;

  const logger = log4jui.getLogger('return');

  const method = response.config.method.toUpperCase();

  logger.trackRequest({
    duration: response.duration,
    name: `Service ${method} call`,
    resultCode: response.status,
    success: true,
    url: response.config.url
  });

  logger.info(`${method} ${formatServiceUrl(response.config.url)} -> ${response.status} (${response.duration}ms)`);
  return response;
}

export function errorInterceptor(error) {
  error.config.metadata.endTime = new Date();
  error.duration = error.config.metadata.endTime - error.config.metadata.startTime;

  const logger = log4jui.getLogger('return');

  const method = error.config.method.toUpperCase();
  const status = valueOrNull(error, 'response.status') || error.status;
  const errorMessage = valueOrNull(error, 'response.data.message') || valueOrNull(error, 'response.data.errorMessage') || error.message;

  // application insights logging
  logger.trackRequest({
    duration: error.duration,
    name: `Service ${method} call`,
    resultCode: status,
    success: false,
    url: error.config.url
  });

  logger.error('Outbound service call failed', {
    duration: error.duration,
    message: errorMessage,
    method,
    status,
    target: formatServiceUrl(error.config.url)
  });

  return Promise.reject(error.response);
}
