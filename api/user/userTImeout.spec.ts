import { expect } from 'chai'
import { anyRolesMatch, getUserSessionTimeout, DEFAULT_SESSION_IDLE_TIME, isRoleMatch} from './userTimeout'

// TODO: What is idle time?
describe('userTimeout', () => {

  /**
   * Note that I deceided to use a Regular Expression here so that we can set the default session timeout via configuration ie. '.',
   * as we require a different default timeout per application, and require this to be easily configurable.
   */
  describe('isRoleMatch()', () => {

    it('should return true if there is a match of the User\'s role to the pattern so' +
      'that the App knows that we need to have a specified session Idle Time for that user role.', () => {
      expect(isRoleMatch('pui-case-manager', 'case-')).to.be.true
    })

    it('should return true if there is a partial match of the User\'s role to the pattern.', () => {
      expect(isRoleMatch('pui-case-manager', 'pui')).to.be.true
    })

    it('should return false if there is no match of the User\'s role to the pattern.', () => {
      expect(isRoleMatch('pui-case-manager', 'dwp-')).to.be.false
    })

    it('should return true for a wildcard pattern, note that this acts as our configurable DEFAULT.', () => {
      expect(isRoleMatch('pui', '.')).to.be.true
    })
  })

  /**
   * Same as isRoleMatch() but testing with multiply roles.
   */
  describe('anyRolesMatch()', () => {
    it('should return true if any of a Users roles match a pattern.', () => {

      const roles = [
        'pui-organisation-manager',
        'pui-user-manager',
        'pui-finance-manager',
      ]

      expect(anyRolesMatch(roles, 'user-manager')).to.be.true
    })

    it('should return true if any of a Users roles match a Regular Expression wildcard.', () => {

      const roles = [
        'pui-organisation-manager',
        'pui-user-manager',
        'pui-finance-manager',
      ]

      expect(anyRolesMatch(roles, '.')).to.be.true
    })

    it('should return false if none of a Users roles match a pattern.', () => {

      const roles = [
        'pui-organisation-manager',
        'pui-user-manager',
        'pui-finance-manager',
      ]

      expect(anyRolesMatch(roles, 'dwp')).to.be.false
    })
  })

  /**
   * The session timeouts array is in PRIORITY ORDER ie. The FIRST session Idle Time will be used
   * if the FIRST pattern matches a role.
   *
   * If the first pattern is not matched, then the second one is tried, etc. If there are no matches
   * then the final wildcard pattern is used - the DEFAULT.
   */
  describe('getUserSessionTimeout()', () => {

    it('should return the FIRST matching Idle Time from the Session Timeouts, if a User Role matches the pattern.', () => {

      const roles = [
        'pui-organisation-manager',
        'pui-case-manager',
      ]

      const roleGroupSessionTimeouts = [
        {
          idleTime: 43200,
          pattern: 'pui-',
        },
        {
          idleTime: 180000,
          pattern: '.',
        },
      ]

      expect(getUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(roleGroupSessionTimeouts[0].idleTime)
    })

    it('should return the LAST matching Idle Time from the Session Timeouts, if there is NO User Role that matches the pattern ie.' +
      'the DEFAULT session timeout.', () => {

      const roles = [
        'pui-organisation-manager',
        'pui-case-manager',
        'pui-finance-manager',
      ]

      const roleGroupSessionTimeouts = [
        {
          idleTime: 43200,
          pattern: 'doesnotmatch',
        },
        // The last item is the default
        {
          idleTime: 72000,
          pattern: '.',
        },
      ]

      expect(getUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(roleGroupSessionTimeouts[1].idleTime)
    })

    it('should return the SECOND matching Idle Time, if the Session Timeout pattern DOES NOT match' +
      'the FIRST Session Timeout pattern.', () => {

      const roles = [
        'pui-organisation-manager',
      ]

      const roleGroupSessionTimeouts = [
        {
          idleTime: 43200,
          pattern: 'doesnotmatch',
        },
        {
          idleTime: 60000,
          pattern: 'organisation',
        },
        {
          idleTime: 72000,
          pattern: '.',
        },
      ]

      expect(getUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(roleGroupSessionTimeouts[1].idleTime)
    })

    it('should return the DEFAULT_SESSION_IDLE_TIME if the XUI team accidentally does not set a DEFAULT session idle time via the' +
      'configuration.', () => {

      const roles = [
        'pui-organisation-manager',
      ]

      const roleGroupSessionTimeouts = []

      expect(getUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(DEFAULT_SESSION_IDLE_TIME)
    })

    /**
     * The following should never happen but the production code should be resilient to this edge case.
     */
    it('should return the DEFAULT_SESSION_IDLE_TIME if there are no User Roles.', () => {

      const roles = []

      const roleGroupSessionTimeouts = [
        {
          idleTime: 43200,
          pattern: 'doesnotmatch',
        },
      ]

      expect(getUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(DEFAULT_SESSION_IDLE_TIME)
    })
  })
})
