
export function getUserTermsAndConditionsUrl(baseUrl: string, userId: string): string {
    return `${baseUrl}/api/v1/termsAndConditions/managecases/users/${userId}/1`
}

export function postUserTermsAndConditionsUrl(baseUrl: string, idamClient: string): string {
    return `${baseUrl}/api/v1/termsAndConditions/managecases/users/${idamClient}/1`
}
