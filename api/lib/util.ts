import { Response } from 'express';
import { PostUserAcceptTandCResponse } from '../interfaces/userAcceptTandCResponse';

export function asyncReturnOrError(
  promise: any,
  message: string,
  res: Response | null,
  logger,
  setResponse: boolean = true
): any {
  return promise
    .then((data) => {
      return data;
    })
    .catch((err) => {
      const msg = `${message}`;
      logger.error(msg);

      if (setResponse) {
        res.status(err.statusCode || 500).send(msg);
      }

      return null;
    });
}

export function some(array, predicate) {
  for (const item in array) {
    if (array[item]) {
      const result = predicate(array[item]);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

export function dotNotation(nestled: string) {
  // eslint-disable-next-line no-useless-escape
  return nestled.replace(/[\[\]]/g, '.');
}

export function valueOrNull(object: any, nestled: string) {
  const value = exists(object, nestled, true);
  return value ? value : null;
}

export function exists(object: any, nestled: string, returnValue = false) {
  const dotArray = dotNotation(nestled).split('.');
  if (object) {
    if (dotArray.length && dotArray[0] !== '') {
      const current = dotArray[0];
      dotArray.shift();
      if (object[current]) {
        return exists(object[current], dotArray.join('.'), returnValue);
      }
      return false;
    }
    return returnValue ? object : true;
  }
  return false;
}

export function shorten(str: string, maxLen: number): string {
  return str.length > maxLen ? `${str.substring(0, maxLen)}...` : str;
}

export function isObject(o) {
  return o !== null && typeof o === 'object' && Array.isArray(o) === false;
}

export function isUserTandCPostSuccessful(postResponse: PostUserAcceptTandCResponse, userId: string): any {
  return postResponse.userId === userId;
}

export function arrayContainOnlySafeCharacters(values: string[]): boolean {
  return values.every(value => 
    (value !== null && typeof value === 'object') 
      ? objectContainsOnlySafeCharacters(value) 
      : !containsDangerousCode(value)
  );
}

export function objectContainsOnlySafeCharacters(values: object): boolean {
  for (const key in values) {
    const inputValue = values[key];
    if (Array.isArray(inputValue)) {
      if (!arrayContainOnlySafeCharacters(inputValue)) {
        return false;
      }
    } else if (inputValue !== null && typeof inputValue === 'object') {
      if (!objectContainsOnlySafeCharacters(inputValue)) {
        return false;
      }
    } else if (typeof inputValue === 'string' && containsDangerousCode(inputValue)) {
      return false;
    }
  }
  return true;
}

/**
 * Checks if a string contains any potentially dangerous code (JavaScript, CSS, URL schemes, JSONP).
 * @param input - The input string to be checked.
 * @returns True if the string contains potentially dangerous code, otherwise false.
 */
export function containsDangerousCode(input: string): boolean {
  // Regular expressions to detect common dangerous patterns
  const jsPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|javascript:|on\w+=|eval\(|new Function\(|document\.cookie|<\s*iframe.*?>.*?<\s*\//i;
  const cssPattern = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>|expression\(|url\(/i;
  const urlSchemePattern = /data:|vbscript:/i;
  const jsonPattern = /callback=|jsonp=/i;
  return jsPattern.test(input) || cssPattern.test(input) || urlSchemePattern.test(input) || jsonPattern.test(input);
}

