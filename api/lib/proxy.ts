/**
 * The setHeaders method now also adds the authorization headers when applicable
 * for better security.
 * When moving to a different proxy middleware, it is important to refactor this as well.
 */
// TODO: remove this entire file in favour of middleware/proxy.ts
import * as express from 'express';
import { exists } from './util';

export function setHeaders(req: express.Request, contentType?: string) {
  const headers: any = {};

  if (req.headers) {
    if (contentType) {
      headers['content-type'] = contentType;
    } else if (req.headers['content-type']) {
      headers['content-type'] = req.headers['content-type'];
    }

    if (req.headers.accept) {
      headers.accept = req.headers.accept;
    }

    if (exists(req, 'headers.experimental')) {
      headers.experimental = req.headers.experimental;
    }

    if (exists(req, 'headers.Authorization')) {
      headers.Authorization = req.headers.Authorization;
    }

    if (req.headers['user-roles'] && req.headers['user-roles'].length) {
      headers['user-roles'] = req.headers['user-roles'];
    }

    if (exists(req, 'headers.ServiceAuthorization')) {
      headers.ServiceAuthorization = req.headers.ServiceAuthorization;
    }
  }

  return headers;
}
