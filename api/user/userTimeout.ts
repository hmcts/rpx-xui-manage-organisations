/**
 * Default Session Idle Time
 *
 * If the timeout configuration has not been set, or the User has no roles ( although the
 * User shouldn't reach this point if they have no roles associated with them ) the
 * default session idle time will be used.
 */

export const DEFAULT_SESSION_IDLE_TIME = 45000

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

  if (!sessionTimeouts.length || !userRoles.length) {
    return DEFAULT_SESSION_IDLE_TIME
  }

  for (const sessionTimeout of sessionTimeouts) {
    if (anyRolesMatch(userRoles, sessionTimeout.pattern)) {
      return sessionTimeout.idleTime
    }
  }
}
