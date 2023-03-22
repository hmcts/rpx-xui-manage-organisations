import { NextFunction, Response } from 'express';
import { EnhancedRequest } from '../models/enhanced-request.interface';

import { handleDelete, handleGet, handlePost, handlePut } from '../common/crudService';
import { getConfigValue } from '../configuration';
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import { PendingPaymentAccount } from './models';

const url: string = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH);
const ORGANISATION_REFDATA_PATH: string = 'refdata/external/v1/organisations';
export async function addDeletePBA(req: EnhancedRequest, res: Response, next: NextFunction): Promise<void> {
    const pendingPaymentAccount: PendingPaymentAccount = req.body.pendingPaymentAccount;
    try {
        const allPromises = [];
        let pendingAddPBAs = {
            paymentAccounts: []
        };
        // do add PBAs
        const fullPath: string = `${url}/${ORGANISATION_REFDATA_PATH}/pba`;
        if (pendingPaymentAccount.pendingAddPaymentAccount &&  pendingPaymentAccount.pendingAddPaymentAccount.length) {
            pendingAddPBAs = {
                paymentAccounts: pendingPaymentAccount.pendingAddPaymentAccount
            };
    
            const addPBAPromise = handlePost(fullPath, pendingAddPBAs, req);
            allPromises.push(addPBAPromise);
        }
        // do delete PBAs
        if (pendingPaymentAccount.pendingRemovePaymentAccount && pendingPaymentAccount.pendingRemovePaymentAccount.length) {
            const pendingRemovePBAs = {
                paymentAccounts: pendingPaymentAccount.pendingRemovePaymentAccount
            };
            const deletePBAPromise = handleDelete(fullPath, pendingRemovePBAs, req);
            allPromises.push(deletePBAPromise);
        }

        // @ts-ignore
        const allResults = await Promise.allSettled(allPromises);
        const { allErrorMessages, rejectedCount, rejectedReason } = handleRejectedResponse(allResults);
        if (rejectedCount > 0) {
            if (onlyReasonIsAlreadyInUse(rejectedReason)) {
                res.status(409).send(allErrorMessages);
            } else {
                res.status(500).send(allErrorMessages);
            }
        } else {
            // no pendingAddPBAs that is delete only
            if (!pendingAddPBAs || pendingAddPBAs.paymentAccounts.length === 0) {
                res.status(202).send({ code: 202, message: 'delete successfully' });
            } else {
                res.status(200).send({ code: 200, message: 'update successfully' });
            }
        }
    } catch (error) {
        next(error);
    }
}

export function onlyReasonIsAlreadyInUse(reasons: any[]): boolean {
    let alreadyInUse = false;
    let errorOtherThanAlreadyInUse = false;
    reasons.forEach( reason => {
        if (reason.status === 409) {
            alreadyInUse = true;
        } else if (reason.status >= 400) {
            errorOtherThanAlreadyInUse = true;
        }
    });
    return alreadyInUse && !errorOtherThanAlreadyInUse;
}

export function handleRejectedResponse(allResults: any): {
    allErrorMessages: string[]
    rejectedPayloads: any[]
    rejectedReason: any[]
    rejectedCount: number
} {
    const allErrorMessages: string[] = [];
    const rejectedPayloads: any[] = [];
    const rejectedReason: any[] = [];
    let rejectedCount: number = 0;

    allResults.forEach( result => {
        const { status, reason }: { status: string; reason: any } = result;
        if (status === 'rejected') {
            const rejectedPayload = JSON.stringify(reason.data);
            rejectedPayloads.push(rejectedPayload);
            rejectedReason.push(reason);
            allErrorMessages.push(
                `{ "request": ${rejectedPayload}, "response": { "status": ${reason.status}, "message": "${reason.data.errorMessage}"}}`
            );
            rejectedCount++;
        }
    });
    return { allErrorMessages, rejectedPayloads, rejectedReason, rejectedCount };
}

export async function addPBA(req: EnhancedRequest, res: Response, next: NextFunction): Promise<void> {
    const markupPath: string = url + req.originalUrl;
    const body: any = req.body;

    try {
        const { status, data }: { status: number; data: any } = await handlePost(markupPath, body, req);
        res.status(status).send(data);
    } catch (error) {
        next(error);
    }
}

export async function deletePBA(req: EnhancedRequest, res: Response, next: NextFunction): Promise<void> {
    const markupPath: string = url + req.originalUrl;
    const body: any = req.body;

    try {
        const { status, data }: { status: number; data: any } = await handleDelete(markupPath, body, req);
        res.status(status).send(data);
    } catch (error) {
        next(error);
    }
}

export async function getPBA(req: EnhancedRequest, res: Response, next: NextFunction): Promise<void> {
    const markupPath: string = url + req.originalUrl;

    try {
        const { status, data }: { status: number; data: any } = await handleGet(markupPath, req, null);
        res.status(status).send(data);
    } catch (error) {
        next(error);
    }
}

export async function updatePBA(req: EnhancedRequest, res: Response, next: NextFunction): Promise<void> {
    const markupPath: string = url + req.originalUrl;
    const body: any = req.body;

    try {
        const { status, data }: { status: number; data: any } = await handlePut(markupPath, body, req);
        res.status(status).send(data);
    } catch (error) {
        next(error);
    }
}
