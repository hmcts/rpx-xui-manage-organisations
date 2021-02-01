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

  if (value) {
    organisationPayload[propertyName] = value
  }
}

export function setDXIfNotNull(organisationPayload, propertyNameArray, arrayName, stateValuesArray) {

  if (stateValuesArray[0] || stateValuesArray[1]) {

    organisationPayload[arrayName] = {}

    for (const key in stateValuesArray) {
      if (stateValuesArray[key] != null && stateValuesArray[key] !== "") {
        organisationPayload[arrayName][propertyNameArray[key]] = stateValuesArray[key]
      } else {
        organisationPayload[arrayName][propertyNameArray[key]] = ""
      }
    }
    organisationPayload[arrayName] = [organisationPayload[arrayName]]
  }
}

export function setPBAIfNotNull(organisationPayload, arrayName, stateValuesArray) {

  organisationPayload[arrayName] = []

  for (const key in stateValuesArray) {
    if (stateValuesArray[key]) {
      organisationPayload[arrayName][key] = stateValuesArray[key]
    }
  }

  organisationPayload[arrayName] = organisationPayload[arrayName].filter(value => Object.keys(value).length !== 0)
}

export function makeOrganisationPayload(stateValues): any {

  const organisationPayload = {
    contactInformation: [
      {
        addressLine1: stateValues.officeAddressOne,
        addressLine2: stateValues.officeAddressTwo,
        county: stateValues.county,
        postCode: stateValues.postcode,
        townCity: stateValues.townOrCity,
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

  let stateValuesArray = [stateValues.PBAnumber1, stateValues.PBAnumber2]
  setPBAIfNotNull(organisationPayload, 'paymentAccount', stateValuesArray)

  stateValuesArray = [stateValues.DXnumber, stateValues.DXexchange]
  const [contactInformationArray] = organisationPayload.contactInformation
  const propertyNameArray = ['dxNumber', 'dxExchange']
  setDXIfNotNull(contactInformationArray, propertyNameArray, 'dxAddress',
    stateValuesArray)

  return organisationPayload
}
