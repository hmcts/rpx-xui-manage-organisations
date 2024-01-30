// TODO: Delete this file once the Address model in CommonLib is available
// and reference it directly from CommonLib
export interface Address {
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  postTown: string;
  county?: string;
  postCode: string;
  country: string;
}
