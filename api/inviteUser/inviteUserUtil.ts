export function getInviteUserUrl(rdProfessionalApiPath: string, reinviteString: string): string {
    return `${rdProfessionalApiPath}/refdata/external/v1/organisations/users/${reinviteString}`
}

export function getReinviteString(payload: any) {
    return payload && payload.isReinvite ? 'resendinvite' : ''
}
