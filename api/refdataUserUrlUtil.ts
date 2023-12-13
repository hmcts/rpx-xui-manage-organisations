export function getRefdataUserUrl(rdProfessionalApiPath: string, pageNumber?: string): string {
  return `${rdProfessionalApiPath}/refdata/external/v1/organisations/users?size=50&page=${pageNumber}`;
}
