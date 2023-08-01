import { NextFunction, Response, Router } from 'express';
import { getConfigValue } from '../../configuration';
import { SERVICES_PRD_COMMONDATA_API } from '../../configuration/references';
import { EnhancedRequest } from '../../lib/models';
import { LovRefDataByServiceModel } from './models/lovRefData.model';

const prdUrl: string = getConfigValue(SERVICES_PRD_COMMONDATA_API);

/**
 * getRefData from category and service ID
 */
export async function getLovRefData(req: EnhancedRequest, res: Response, next: NextFunction) {
  const { serviceId, categoryId, isChildRequired } = req.query as { serviceId: string, categoryId: string, isChildRequired: string };

  const params = serviceId ? new URLSearchParams({ serviceId, isChildRequired }) : new URLSearchParams({ isChildRequired });

  const markupPath: string = `${prdUrl}/refdata/commondata/lov/categories/${categoryId}?${params}`;

  try {
    const { status, data }: { status: number, data: LovRefDataByServiceModel } = await req.http.get(markupPath);
    res.status(status).send(data.list_of_values);
  } catch (error) {
    next(error);
  }
}

export const router = Router({ mergeParams: true });
router.get('/', getLovRefData);

export default router;
