/**
 * Default Session Idle Time
 *
 * If the timeout configuration has not been set, or the User has no roles ( although the
 * User shouldn't reach this point if they have no roles associated with them ) the
 * default session idle time will be used.
 */

export const DEFAULT_SESSION_TIMEOUT = {
  idleModalDisplayTime: 2,
  totalIdleTime: 12,
}

/**
 * Is Role Match
 *
 * Checks if a User's role, matches a specified Regular Expression.
 *
 * We use a Regular Expression so that we can set the default session timeout via configuration ie. '.', hence we used
 * JS .match over .includes. Note that we should never fall over to using the DEFAULT_SESSION_IDLE_TIME in code. As
 * there will be a different default session timeout per application, hence setting it via configuration.
 *
 * @param role - 'pui-case-manager'
 * @param pattern - 'case-manager' / 'pui-' / '.'
 * @returns {boolean}
 */
export const isRoleMatch = (role: string, pattern: string): boolean => {

  return Boolean(role.match(new RegExp(pattern)))
}

/**
 * Any Roles Match
 *
 * Checks an array of roles for pattern matches.
 *
 * @param roles - [
 *  'pui-case-manager',
 *  'pui-finance-manager',
 * ]
 * @param pattern - 'case-manager' / 'pui-' / '.'
 */
export const anyRolesMatch = (roles: string[], pattern: string): boolean => {

  return roles.filter(role => isRoleMatch(role, pattern)).length > 0
}

/**
 * Sort User Roles
 *
 * Should sort the User's Roles alphabetically. Why? So that a priority order can be given to the Session Timeout +
 * configuration list.
 *
 * Example: If we want a PUI Session Timeout to be given preference over another Session Timeout it would be further
 * up the Session Timeout Configuration list.
 *
 * @param - [
 * 'caseworker-divorce-financialremedy',
 * 'pui-user-manager',
 * 'caseworker-probate-solicitor',
 * 'caseworker',
 * 'caseworker-probate',
 * 'pui-finance-manager',
 * 'caseworker-divorce-solicitor',
 * ]
 * @return - [
 * 'caseworker',
 * 'caseworker-divorce-financialremedy',
 * 'caseworker-divorce-solicitor',
 * 'caseworker-probate',
 * 'caseworker-probate-solicitor',
 * 'pui-user-manager',
 * 'pui-finance-manager',
 * ]
 */
export const sortUserRoles = (roles: string[]) => roles.sort()

/**
 * Get User Session Timeout
 *
 * We calculate the timeout for this user.
 *
 * A user is given a specified timeout based on their User Roles, and a given set of
 * statically configured Session Timeouts, defined by the XUI team for a User Role Group.
 *
 * Example:
 *
 * A Department of Work & Pensions User should have an Idle Time of 12 minutes, and their
 * countdown takes 3 minutes.
 *
 * Note that the Session Timeouts needs to be easily configurable and will change for each XUI application.
 *
 * TODO: What is Idle Time?
 *
 * Important: the Session Timeout array should be in PRIORITY ORDER, with the
 * DEFAULT for this application being the last item in the array.
 *
 * @param userRoles - [
 * 'pui-organisation-manager',
 * ]
 * @param sessionTimeouts - @see unit tests
 * @returns
 */
export const getUserSessionTimeout = (userRoles, sessionTimeouts) => {

  const sortedUserRoles = sortUserRoles(userRoles)

  for (const sessionTimeout of sessionTimeouts) {
    if (anyRolesMatch(sortedUserRoles, sessionTimeout.pattern)) {
      return sessionTimeout
    }
  }

  return DEFAULT_SESSION_TIMEOUT
}
