/**
 * TODO: What does idle time mean? / do
 *
 * Let's put it to 12 minutes.
 *
 * Default idle time in milliseconds, equivalent to 12 and a bit minutes.
 */

export const DEFAULT_SESSION_IDLE_TIME = 45000

/**
 * Is Role Match
 *
 * Checks if a User's role, matches a specified Regular Expression.
 *
 * TODO: Can we use wildcard for any?
 * TODO: We need one for all. Ok we might need reg Ex.
 * TODO: Is RegEx too overkill for this? and shall we just use includes.
 *
 * @param role - 'pui-case-manager'
 * @param roleRegExPattern - 'case-manager' / 'pui-' / '*'
 * @returns {boolean}
 */
export const isRoleMatch = (role, pattern) => Boolean(role.match(new RegExp(pattern)))
// export const isRoleMatch = (role, roleRegExPattern) => role.includes(roleRegExPattern)

export const anyRolesMatch = (roles, pattern) => {
  return roles.filter(role => isRoleMatch(role, pattern)).length > 0
}

/**
 * Calculate User Session Timeout
 *
 * We calculate the timeout for this user.
 *
 * A User is given a specified timeout based on their userRole set.
 *
 * ie. a Department of Work & Pensions user has a timeout of 12 minutes,
 * whereas all other users should have a timeout of 50 minutes.
 *
 * Note that there should always be a default value set within the session
 * timeouts, this is set via configuration and should always be included.
 * TODO: userRoleGroupSessionTimeouts are from config.
 * @param userRoles -
 * @param userGroupTimeouts -
 * @returns
 */
export const calcUserSessionTimeout = (userRoles, userRoleGroupSessionTimeouts) => {

  if (!userRoleGroupSessionTimeouts.length || !userRoles.length) {
    return DEFAULT_SESSION_IDLE_TIME
  }

  for (const groupSessionTimeout of userRoleGroupSessionTimeouts) {
    if (anyRolesMatch(userRoles, groupSessionTimeout.pattern)) {
      return groupSessionTimeout.idleTime
    }
  }
}
