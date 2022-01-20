import { NextFunction, Response } from 'express';

import { handleDelete, handleGet, handlePost, handlePut } from '../common/mockService';
import { getConfigValue } from '../configuration';
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import { EnhancedRequest } from '../lib/models';
import { PendingPaymentAccount } from './models/pendingPaymentAccount.model';
import * as mock from './pbaService.mock';

mock.init();

const url: string = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH);

export async function addDeletePBA(req: EnhancedRequest, res: Response, next: NextFunction): Promise<void> {
  const pendingPaymentAccount: PendingPaymentAccount = req.body.pendingPaymentAccount;
try {
  const allPromises = [];
  // do add PBAs
  const addPBAPath: string = `${url}/api/pba/addPBA`;
  const pendingAddPBAs = pendingPaymentAccount.pendingAddPaymentAccount;
  const addPBAPromise = handlePost(addPBAPath, pendingAddPBAs, req);
  allPromises.push(addPBAPromise);
  // do delete PBAs
  const deletePBAPath: string = `${url}/api/pba/deletePBA`;
  const pendingRemovePBAs = pendingPaymentAccount.pendingRemovePaymentAccount;
  const deletePBAPromise = handleDelete(deletePBAPath, pendingRemovePBAs, req);
  allPromises.push(deletePBAPromise);

  // @ts-ignore
  const allResults = await Promise.allSettled(allPromises);
  const { allErrorMessages, rejectedCount } = handleRejectedResponse(allResults);
  if (rejectedCount > 0) {
    res.status(500).send(allErrorMessages);
  } else {
    // no pendingAddPBAs that is delete only
    if (!pendingAddPBAs || pendingAddPBAs.length === 0) {
      res.status(202).send({code: 202, message: 'delete successfully'});
    } else {
      res.status(200).send({code: 200, message: 'update successfully'});
    }
  }
} catch (error) {
  next(error);
}
}

function handleRejectedResponse(allResults: any): { allErrorMessages: string[],
rejectedPayloads: any[], rejectedReason: any[], rejectedCount: number} {
const allErrorMessages: string[] = [];
const rejectedPayloads: any[] = [];
const rejectedReason: any[] = [];
let rejectedCount: number = 0;

allResults.forEach(result => {
  const {status, reason}: {status: string, reason: any} = result;
  if (status === 'rejected') {
    const rejectedPayload = JSON.stringify(reason.data);
    rejectedPayloads.push(rejectedPayload);
    rejectedReason.push(reason);
    allErrorMessages.push(`{request: ${rejectedPayload}, response: {${reason.status} ${reason.data.errorMessage}}}`);
    rejectedCount ++;
  }
});
return { allErrorMessages, rejectedPayloads, rejectedReason, rejectedCount };
}

export async function addPBA(req: EnhancedRequest, res: Response, next: NextFunction): Promise<void> {
const markupPath: string = url + req.originalUrl;
const body: any = req.body;

try {
  const {status, data}: { status: number, data: any } = await handlePost(markupPath, body, req);
  res.status(status).send(data);
  } catch (error) {
    next(error);
  }
}

export async function deletePBA(req: EnhancedRequest, res: Response, next: NextFunction): Promise<void> {
  const markupPath: string = url + req.originalUrl;
  const body: any = req.body;

  try {
    const {status, data}: { status: number, data: any } = await handleDelete(markupPath, body, req);
    res.status(status).send(data);
  } catch (error) {
    next(error);
  }
}

export async function getPBA(req: EnhancedRequest, res: Response, next: NextFunction): Promise<void> {
  const markupPath: string = url + req.originalUrl;

  try {
    const { status, data }: { status: number, data: any } = await handleGet(markupPath, req);
    res.status(status).send(data);
  } catch (error) {
    next(error);
  }
}

export async function updatePBA(req: EnhancedRequest, res: Response, next: NextFunction): Promise<void> {
  const markupPath: string = url + req.originalUrl;
  const body: any = req.body;

  try {
    const {status, data}: { status: number, data: any } = await handlePut(markupPath, body, req);
    res.status(status).send(data);
  } catch (error) {
    next(error);
  }
}
