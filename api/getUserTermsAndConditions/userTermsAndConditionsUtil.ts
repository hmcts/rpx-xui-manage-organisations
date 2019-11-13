
export function getUserTermsAndConditionsUrl(baseUrl: string, userId: string, idamClient: string): string {
    return `${baseUrl}/api/v1/termsAndConditions/managecases/users/${userId}/${idamClient}/1`
}
