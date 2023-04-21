export function getRefdataAllUserListUrl(rdProfessionalApiPath: string): string {
  return `${rdProfessionalApiPath}/refdata/external/v1/organisations/users?returnRoles=false`;
}
