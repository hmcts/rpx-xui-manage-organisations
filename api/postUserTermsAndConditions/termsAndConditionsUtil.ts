export function postUserTermsAndConditionsUrl(baseUrl: string, idamClient: string): string {
    return `${baseUrl}/api/v1/termsAndConditions/${idamClient}/users/accept/version`
}
