import * as exceptionFormatter from 'exception-formatter';
import { getConfigValue } from '../configuration';
import { MAX_LOG_LINE } from '../configuration/references';
import * as log4jui from './log4jui';
import { shorten, valueOrNull } from './util';

const exceptionOptions = {
  maxLines: 1
};

export function requestInterceptor(request) {
  const logger = log4jui.getLogger('outgoing');

  const url = shorten(request.url, getConfigValue(MAX_LOG_LINE));
  logger.info(`${request.method.toUpperCase()} to ${url}`);
  // add timings to requests
  request.metadata = { startTime: new Date() };
  return request;
}

export function successInterceptor(response) {
  response.config.metadata.endTime = new Date();
  response.duration = response.config.metadata.endTime - response.config.metadata.startTime;

  const logger = log4jui.getLogger('return');

  const url = shorten(response.config.url, getConfigValue(MAX_LOG_LINE));

  logger.trackRequest({
    duration: response.duration,
    name: `Service ${response.config.method.toUpperCase()} call`,
    resultCode: response.status,
    success: true,
    url: response.config.url
  });

  logger.info(`Success on ${response.config.method.toUpperCase()} to ${url} (${response.duration})`);
  return response;
}

export function errorInterceptor(error) {
  // console.log('url: ', error.response.config.url)
  // console.log(error)
  error.config.metadata.endTime = new Date();
  error.duration = error.config.metadata.endTime - error.config.metadata.startTime;

  const logger = log4jui.getLogger('return');

  const url = shorten(error.config.url, getConfigValue(MAX_LOG_LINE));

  // application insights logging
  logger.trackRequest({
    duration: error.duration,
    name: `Service ${error.config.method.toUpperCase()} call`,
    resultCode: error.status,
    success: true,
    url: error.config.url
  });

  // const status = valueOrNull(error, 'response.status') ? error.response.status : Error(error).message
  let data = valueOrNull(error, 'response.data.details');
  if (!data) {
    data = valueOrNull(error, 'response.status') ? JSON.stringify(error.response.data, null, 2) : null;
    logger.error(`Error on ${error.config.method.toUpperCase()} to ${url} in (${error.duration}) - ${error} \n
        ${data ? exceptionFormatter(data, exceptionOptions) : null}`);
  } else {
    logger.error(`Error on ${error.config.method.toUpperCase()} to ${url} in (${error.duration}) - ${error} \n
        ${JSON.stringify(data)}`);
  }

  return Promise.reject(error.response);
}
