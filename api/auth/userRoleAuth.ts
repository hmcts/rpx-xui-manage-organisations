export const MANAGE_ORGANISATION_ROLES = [
  'pui-organisation-manager',
  'pui-user-manager',
  'pui-finance-manager',
]

export const PUI_CASE_MANAGER = 'pui-case-manager'

/**
 * User Has Application Access
 *
 * We check that a User has access to the Manage Organisations application; they need to have both a
 * pui-case-manager role and a manage organisations role as per business requirements to have access.
 *
 * If the User only has a pui-case-manager role, they should not be allowed to access the application.
 *
 * @see EUI-836
 * @param roles
 */
export function userHasAppAccess(roles) {

  return hasManageOrganisationRole(roles, MANAGE_ORGANISATION_ROLES)
}

/**
 * Checks if a User has a pui-case-manager role
 *
 * @param roles
 */
export function hasPuiCaseManagerRole(roles) {

  return roles.includes(PUI_CASE_MANAGER)
}

/**
 * Check if a User has a Manage Organisational role.
 *
 * @param roles - @see unit
 * @param manageOrganisationRoles - @see unit
 */
export function hasManageOrganisationRole(roles, manageOrganisationRoles) {

  const intersectingRoles = manageOrganisationRoles.filter(manageOrganisationRole => roles.includes(manageOrganisationRole))

  return intersectingRoles.length > 0
}
