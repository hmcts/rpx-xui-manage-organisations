import * as log4js from 'log4js';
import { getConfigValue } from '../configuration';
import { LOGGING } from '../configuration/references';
import { client } from './appInsights';

let logger = null;

// This is done to mimic log4js calls
const REDACTED = '[REDACTED]';
const SENSITIVE_KEY_PATTERN = /authorization|cookie|password|secret|token|oneTimePassword|otp/i;

export function getLogger(category: string) {
  logger = log4js.getLogger(category);
  logger.level = getConfigValue(LOGGING) || 'off';

  return {
    _logger: logger,
    debug,
    error,
    info,
    trackRequest,
    warn
  };
}

function redactSensitiveValues(value: any, seen = new WeakSet()): any {
  if (!value || typeof value !== 'object') {
    return value;
  }

  if (value instanceof Error) {
    return {
      message: value.message,
      name: value.name,
      stack: value.stack
    };
  }

  if (seen.has(value)) {
    return '[Circular]';
  }
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveValues(item, seen));
  }

  return Object.keys(value).reduce((redacted, key) => {
    redacted[key] = SENSITIVE_KEY_PATTERN.test(key) ? REDACTED : redactSensitiveValues(value[key], seen);
    return redacted;
  }, {});
}

function formatMessage(message: any): string {
  if (message instanceof Error) {
    return message.stack || message.message;
  }

  if (message && typeof message === 'object') {
    try {
      return JSON.stringify(redactSensitiveValues(message));
    } catch {
      return String(message);
    }
  }

  return String(message);
}

function formatMessages(messages: any[]): string {
  return messages.map(formatMessage).join(' ');
}

function info(...messages: any[]) {
  const fullMessage = formatMessages(messages);

  const category = this._logger.category;
  if (client) {
    client.trackTrace({ message: `[INFO] ${category} - ${fullMessage}` });
  }
  this._logger.info(fullMessage);
}

function warn(...messages: any[]) {
  const fullMessage = formatMessages(messages);

  this._logger.warn(fullMessage);
}

function debug(...messages: any[]) {
  const fullMessage = formatMessages(messages);
  this._logger.debug(fullMessage);
}

function trackRequest(obj: any) {
  if (client) {
    client.trackRequest(obj);
  }
}

function error(...messages: any[]) {
  const fullMessage = formatMessages(messages);

  const category = this._logger.category;
  if (client) {
    client.trackException({ exception: new Error(`[ERROR] ${category} - ${fullMessage}`) });
  }
  this._logger.error(fullMessage);
}
