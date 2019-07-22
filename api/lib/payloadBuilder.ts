import { OrganisationPayload } from '../interfaces/organisationPayload'
import { test } from 'mocha';

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

export function setPropertyIfNotNull(organisationPayload, propertyName, value) {
  if (value != null) {
    organisationPayload[propertyName] =
      value
  }
}

export function setDXIfNotNull(organisationPayload, propertyNameArray, arrayName, stateValuesArray) {

  if (stateValuesArray[0] != undefined || stateValuesArray[1] != undefined) {

    organisationPayload[arrayName] = {}

    for (const key in stateValuesArray) {
      if (stateValuesArray[key] != null && stateValuesArray[key] != "")
        organisationPayload[arrayName][propertyNameArray[key]] = stateValuesArray[key]
      else
        organisationPayload[arrayName][propertyNameArray[key]] = ""
    }
    organisationPayload[arrayName] = [organisationPayload[arrayName]]
  }
}

export function setPBAIfNotNull(organisationPayload, arrayName, stateValuesArray) {

  organisationPayload[arrayName] = []
  for (const key in stateValuesArray) {
    if (stateValuesArray[key] != null && stateValuesArray[key] != "")
      organisationPayload[arrayName][key] = stateValuesArray[key]
  }

}

export function makeOrganisationPayload(stateValues): any {

  const organisationPayload = {
    contactInformation: [
      {
        addressLine1: stateValues.officeAddressOne,
        addressLine2: stateValues.officeAddressTwo,
        county: stateValues.county,
        postcode: stateValues.postcode,
        townCity: stateValues.townOrCity
      },
    ],
    name: stateValues.orgName,
    superUser: {
      email: stateValues.emailAddress,
      firstName: stateValues.firstName,
      lastName: stateValues.lastName,
    },
  }

  setPropertyIfNotNull(organisationPayload, 'sraId', stateValues.sraNumber)

  var stateValuesArray = [stateValues.PBAnumber1, stateValues.PBAnumber2]
  setPBAIfNotNull(organisationPayload, 'paymentAccount', stateValuesArray)

  stateValuesArray = [stateValues.DXnumber, stateValues.DXexchange]
  var [contactInformationArray] = organisationPayload.contactInformation
  var propretyNameArray = ['dxNumber', 'dxExchange']
  setDXIfNotNull(contactInformationArray, propretyNameArray, 'dxAddress',
    stateValuesArray)

  return organisationPayload;
}
