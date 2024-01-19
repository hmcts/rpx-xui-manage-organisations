import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import * as log4jui from '../lib/log4jui';
import { exists, valueOrNull } from '../lib/util';
import { getRefdataAllUserListUrl } from '../refdataAllUserListUrlUtil';

const logger = log4jui.getLogger('retrive-access-types');

export async function handleRetriveAccessTypes(req: Request, res: Response) {
  const payload = req.body;
  //   try {
  //     const rdProfessionalApiPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH);
  //     const url = `${rdProfessionalApiPath}/retrieve-access-types`;
  //     logger.info('INVITE USER: request URL:: ', url);
  //     logger.info('INVITE USER: payload:: ', payload);
  //     const response = await req.http.post(url, payload);
  //     logger.info('response::', response.data);
  //     res.send(response.data);
  //   } catch (error) {
  //     logger.error('error', error);
  //     const status = exists(error, 'status') ? error.status : 500;
  //     const errReport = {
  //       apiError: valueOrNull(error, 'data.errorMessage'),
  //       apiStatusCode: status,
  //       message: valueOrNull(error, 'data.errorDescription')
  //     };
  //     res.status(status).send(errReport);
  //   }
  const dummyAccessTypes = {
    'jurisdictions': [
      {
        'jurisdictionid': '6',
        'jurisdictionName': 'Civil',
        'accessTypes': [
          {
            'organisationProfileId': 'SOLICITOR_PROFILE',
            'accessTypeId': '10',
            'accessMandatory': true,
            'accessDefault': true,
            'display': true,
            'description': 'Should be checked because of the access default and disabled because it\'s mandatory',
            'hint': 'Hint  for the BEFTA Master Jurisdiction Access Type.',
            'displayOrder': 6,
            'roles': [
              {
                'caseTypeId': '38459',
                'organisationalRoleName': 'rolename',
                'groupRoleName': 'groupname',
                'caseGroupIdTemplate': 'CIVIL:all:CIVIL:AS1:$ORGID$'
              }
            ]
          },
          {
            'organisationProfileId': 'SOLICITOR_PROFILE',
            'accessTypeId': '22',
            'accessMandatory': false,
            'accessDefault': false,
            'display': false,
            'description': 'Should not be visible',
            'hint': 'Hint  for the BEFTA Master Jurisdiction Access Type.',
            'displayOrder': 2,
            'roles': [
              {
                'caseTypeId': '38459',
                'organisationalRoleName': 'rolename',
                'groupRoleName': 'groupname',
                'caseGroupIdTemplate': 'CIVIL:all:CIVIL:AS1:$ORGID$'
              }
            ]
          },
          {
            'organisationProfileId': 'SOLICITOR_PROFILE',
            'accessTypeId': '101',
            'accessMandatory': false,
            'accessDefault': false,
            'display': true,
            'description': 'Just an extra',
            'hint': 'Hint  for the BEFTA Master Jurisdiction Access Type.',
            'displayOrder': 3,
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
        'jurisdictionid': '5',
        'jurisdictionName': 'Family Public Law',
        'accessTypes': [
          {
            'organisationProfileId': 'SOLICITOR_PROFILE',
            'accessTypeId': '34',
            'accessMandatory': false,
            'accessDefault': false,
            'display': true,
            'description': 'This was is a pre-existing selection as true',
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
      }
    ]
  };

  res.json(dummyAccessTypes.jurisdictions);
}

export const router = Router({ mergeParams: true });

router.post('/', handleRetriveAccessTypes);

export default router;
