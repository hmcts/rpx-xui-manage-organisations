export function getRefdataUserDetailsUrl(rdProfessionalApiPath: string): string {
    return `${rdProfessionalApiPath}/refdata/external/v1/organisations/users?returnRoles=true&size=100&page=0`
}
