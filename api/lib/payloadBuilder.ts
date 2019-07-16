import { OrganisationPayload } from '../interfaces/organisationPayload'

/**
 * makeOrganisationPayload
 *
 * Constructs payload to POST data to the /organisations endpoint.
 *
 * TODO: Note that if we add the dxAddress in, we get a 500 status error.
 * Fix required on the api. Awaiting fix. JIRA ticket raised: PUID-103
 *
 * @param stateValues
 * @return
 */

// should take in a string, or null
// returns a string
// if null return empty string
function notNullOrUndefined(fieldMapping, value) {
  if (value) {
    return value;
  }
  if (fieldMapping == 'pba' && value === null) {
    // test values because ref data will not accept empty string must be in format PBAxxx
    return 'PBA1234567678';
  }
  if (fieldMapping == 'sraId' && value == undefined) {
    // test values because ref data will not accept empty string must be in format SRAxxx
    return 'sraTempNumber';
  }
  if (fieldMapping == 'dxExchange' && value == null) {
    // test values because ref data will not accept empty string must be in > 20chars
    return '12345678901234567890';
  }
  if (fieldMapping == 'dxNumber' && value == null) {
    // test values because ref data will not accept empty string must be in > 13chars
    return '666666666666';
  }
}

export function makeOrganisationPayload(stateValues): any {

  return {
    contactInformation: [
      {
        addressLine1: stateValues.officeAddressOne,
        addressLine2: stateValues.officeAddressTwo,
        county: stateValues.county,
        postcode: stateValues.postcode,
        townCity: stateValues.townOrCity,
        dxAddress: [
          {
            dxExchange: notNullOrUndefined('dxExchange', stateValues.DXexchange),
            dxNumber: notNullOrUndefined('dxNumber', stateValues.DXnumber),
          },
        ],
      },
    ],
    name: stateValues.orgName,
    pbaAccounts: [
      {
        pbaAccounts: notNullOrUndefined('pba', stateValues.PBAnumber1),
        pbaNumber: notNullOrUndefined('pba', stateValues.PBAnumber2),
      },
    ],
    sraId: notNullOrUndefined('sraId', stateValues.sraNumber),
    superUser: {
      email: stateValues.emailAddress,
      firstName: stateValues.firstName,
      lastName: stateValues.lastName,
    },
  }
}
