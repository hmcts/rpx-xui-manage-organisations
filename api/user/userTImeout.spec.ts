import { expect } from 'chai'
import {calcUserSessionTimeout, checkForRoleMatch, DEFAULT_SESSION_IDLE_TIME} from './userTimeout'


// TODO: What is idle time?
describe('userTimeout', () => {
  it('should return the default time out of 12 minutes if there is an empty array input, as ' +
    'this is the least amount of time a user group can be logged in for.', () => {

    /**
     * userRoleRegExPattern is a pattern to match the user roles against to set the timeout for
     * that user role. Note do not add a forward /, this is placed on within the code, using
     * new RegExp(); In the code we are passing the string into this.
     * @type {{idleTime: number; userRolePattern: string}[]}
     */
    const roleGroupSessionTimeouts = [
      {
        idleTime: 43200, // idle time in seconds
        userRoleRegExPattern: '*DwP', // takes in regEx so you can set this to be DwPensions.
      },
      {
        idleTime: 180000, // idle time in seconds
        userRoleRegExPattern: '*', // takes in regEx so you can set this to be DwPensions.
      },
    ]

    const roles = []

    expect(calcUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(DEFAULT_SESSION_IDLE_TIME)
  })

  it('should return false if the user role regEx pattern does not match the User\'s role, so' +
    'that the system knows if we need to have a specific idle time for that user.', () => {
    expect(checkForRoleMatch('pui-case-manager', 'dwp-')).to.be.false
  });

  // it('should return the idle time of a User, if they have a specific userRole.', () => {
  //
  //   const roleGroupSessionTimeouts = [
  //     {
  //       idleTime: 43200, // idle time in seconds
  //       userRole: '*DwP', // takes in regEx so you can set this to be DwPensions.
  //     },
  //     {
  //       idleTime: 180000, // idle time in seconds
  //       userRole: '*', // takes in regEx so you can set this to be DwPensions.
  //     },
  //   ]
  //
  //   const roles = [
  //     'dwp-manager',
  //   ]
  //
  //   expect(calcUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(false)
  // })
})
