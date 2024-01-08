import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import * as log4jui from '../lib/log4jui';
import { exists, valueOrNull } from '../lib/util';
import { getRefdataAllUserListUrl } from '../refdataAllUserListUrlUtil';

const logger = log4jui.getLogger('retrive-access-types');

export async function handleRetriveAccessTypes(req: Request, res: Response) {
//   try {
//     const rdProfessionalApiPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH);
//     const response = await req.http.get(getRefdataAllUserListUrl(rdProfessionalApiPath));
//     logger.info('response::', response.data);
//     res.send(response.data);
//   } catch (error) {
//     logger.error('error', error);
//     const status = exists(error, 'statusCode') ? error.statusCode : 500;
//     const errReport = {
//       apiError: exists(error, 'data.message') ? error.data.message : valueOrNull(error, 'statusText'),
//       apiStatusCode: status,
//       message: 'All List of users route error'
//     };
//     res.status(status).send(errReport);
//   }
  const dummyAccessTypes = {
    'jurisdictions': [
      {
        'jurisdictionid': '6',
        'jurisdictionName': 'BEFTA_JURISDICTION_1',
        'accessTypes': [
          {
            'organisationProfileId': 'SOLICITOR_PROFILE',
            'accessTypeId': 'default',
            'accessMandatory': false,
            'accessDefault': false,
            'display': false,
            'description': 'Description for the BEFTA Master Jurisdiction Access Type.',
            'hint': 'Hint  for the BEFTA Master Jurisdiction Access Type.',
            'displayOrder': 10,
            'roles': [
              {
                'caseTypeId': '38459',
                'organisationalRoleName': 'rolename',
                'groupRoleName': 'groupname',
                'caseGroupIdTemplate': 'CIVIL:all:CIVIL:AS1:$ORGID$'
              }
            ]
          }
        ]
      },
      {
        'jurisdictionid': '6',
        'jurisdictionName': 'BEFTA_JURISDICTION_1',
        'accessTypes': [
          {
            'organisationProfileId': 'SOLICITOR_PROFILE',
            'accessTypeId': 'default',
            'accessMandatory': true,
            'accessDefault': true,
            'display': true,
            'description': 'Description for the BEFTA Master Jurisdiction Access Type.',
            'hint': 'Hint  for the BEFTA Master Jurisdiction Access Type.',
            'displayOrder': 20,
            'roles': [
              {
                'caseTypeId': '38458',
                'organisationalRoleName': 'rolename',
                'groupRoleName': 'groupname',
                'caseGroupIdTemplate': 'CIVIL:all:CIVIL:AS1:$ORGID$'
              }
            ]
          }
        ]
      }
    ]
  };

  res.json(dummyAccessTypes.jurisdictions);
}

export const router = Router({ mergeParams: true });

router.post('/', handleRetriveAccessTypes);

export default router;
