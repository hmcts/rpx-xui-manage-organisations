import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import * as log4jui from '../lib/log4jui';
import { exists, valueOrNull } from '../lib/util';
import { getRefdataAllUserListUrl } from '../refdataAllUserListUrlUtil';
import { processAccessTypes } from './accessTypesComparison';

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
        'jurisdictionName': 'BEFTA_JURISDICTION_1',
        'accessTypes': [
          {
            'organisationProfileId': 'SOLICITOR_PROFILE',
            'accessTypeId': '5151',
            'accessMandatory': false,
            'accessDefault': false,
            'display': true,
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
          },
          {
            'organisationProfileId': 'SOLICITOR_PROFILE',
            'accessTypeId': '123',
            'accessMandatory': true,
            'accessDefault': true,
            'display': true,
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
          },
          {
            'organisationProfileId': 'SOLICITOR_PROFILE',
            'accessTypeId': '928',
            'accessMandatory': false,
            'accessDefault': false,
            'display': true,
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
        'jurisdictionid': '5',
        'jurisdictionName': 'BEFTA_JURISDICTION_1',
        'accessTypes': [
          {
            'organisationProfileId': 'SOLICITOR_PROFILE',
            'accessTypeId': '819',
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

export async function compareAccessTypes(req: Request, res: Response) {
  try {
    const payload = req.body;
    if (!payload || !payload.orgAccessTypes || !payload.userSelections) {
      res.status(400).json({ error: 'Missing required fields in the payload' });
      return;
    }
    const comparedUserSelections = processAccessTypes(payload.orgAccessTypes, payload.userSelections);
    res.json(comparedUserSelections);
  } catch (error) {
    console.error('Error in compareAccessTypes:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}

export const router = Router({ mergeParams: true });

router.post('/', handleRetriveAccessTypes);
router.post('/compare', compareAccessTypes);
export default router;
