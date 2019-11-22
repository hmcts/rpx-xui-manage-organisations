
export function getUserTermsAndConditionsUrl(baseUrl: string, userId: string, idamClient: string): string {
    return `${baseUrl}/api/v1/termsAndConditions/${idamClient}/users/${userId}`
}
