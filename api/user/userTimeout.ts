/**
 * TODO: What does idle time mean? / do
 *
 * Let's put it to 12 minutes.
 *
 * Default idle time in milliseconds, equivalent to 12 minutes.
 */

export const DEFAULT_SESSION_IDLE_TIME = 43200

export const checkForRoleMatch = (role, regEx) => {
  return Boolean(role.match(new RegExp(regEx)))
};
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
 * @param userRoles -
 * @param userGroupTimeouts -
 * @returns
 */
export const calcUserSessionTimeout = (userRoles, roleGroupSessionTimeouts) => {

  // run through user roles against to see if userRole
  // exists
  // roleGroupSessionTimeouts.forEach(myFunction);

  userRoles.filter(role => {
    return role.search()
  })

  return DEFAULT_SESSION_IDLE_TIME
}
