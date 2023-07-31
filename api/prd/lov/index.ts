import { NextFunction, Response, Router } from 'express';
import { getConfigValue } from '../../configuration';
import { SERVICES_PRD_COMMONDATA_API } from '../../configuration/references';
import { EnhancedRequest } from '../../lib/models';
import { LovRefDataByServiceModel } from './models/lovRefData.model';

const prdUrl: string = getConfigValue(SERVICES_PRD_COMMONDATA_API);

/**
 * getRefData from category and service ID
 */
export async function getLovRefData(req: EnhancedRequest, res: Response) {
  const { serviceId, categoryId, isChildRequired } = req.query as { serviceId: string, categoryId: string, isChildRequired: string };

  console.log('SERVICE ID', serviceId);
  console.log('CATEGORY ID', categoryId);
  console.log('IS CHILD REQUIRED', isChildRequired);

  const params = new URLSearchParams({ serviceId, isChildRequired });
  const markupPath: string = `${prdUrl}/refdata/commondata/lov/categories/${categoryId}?${params}`;

  // try {
  //   console.log('PARAMS', params);
  //   console.log('MARKUP PATH', markupPath);

  //   const { status, data }: { status: number, data: LovRefDataByServiceModel } = await req.http.get(markupPath);
  //   console.log('STATUS', status);
  //   console.log('DATA', data);
  //   res.status(status).send(data.list_of_values);
  // } catch (error) {
  //   next(error);
  // }

  res.status(200).send({});
}

export const router = Router({ mergeParams: true });
router.get('/getLovRefData', getLovRefData);

export default router;
