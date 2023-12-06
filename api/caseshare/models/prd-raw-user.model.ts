export interface PRDRawUserModel {
  userIdentifier: string
  email: string
  firstName: string
  idamStatus: string
  lastName: string,
  accessTypes?: PRDRawAccessTypeModel[]
}

export interface PRDRawAccessTypeModel {
  jurisdicationId: string
  organisationProfileId: string
  accessTypeId: string
  enabled: boolean
}
