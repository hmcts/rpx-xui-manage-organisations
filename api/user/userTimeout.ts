/**
 * TODO: What does idle time mean? / do
 *
 * Let's put it to 12 minutes.
 *
 * Default idle time in milliseconds, equivalent to 12 minutes.
 */

export const DEFAULT_SESSION_IDLE_TIME = 43200

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
export const isRoleMatch = (role, roleRegExPattern) => Boolean(role.match(new RegExp(roleRegExPattern)))
// export const isRoleMatch = (role, roleRegExPattern) => role.includes(roleRegExPattern)

export const anyRolesMatch = (roles, roleRegExPattern) => {
  return roles.filter(role => isRoleMatch(role, roleRegExPattern)).length > 0
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
 * TODO: userRoleGroupSessionTimeouts are from config.
 * @param userRoles -
 * @param userGroupTimeouts -
 * @returns
 */
export const calcUserSessionTimeout = (userRoles, userRoleGroupSessionTimeouts) => {

  userRoleGroupSessionTimeouts.forEach(groupSessionTimeout => {
    if (anyRolesMatch(userRoles, groupSessionTimeout.userRolePattern)) {
      return groupSessionTimeout.idleTime
    }
  })
}
