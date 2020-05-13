import {expect} from 'chai'
import {anyRolesMatch, DEFAULT_SESSION_TIMEOUT, getUserSessionTimeout, isRoleMatch, sortUserRoles} from './userTimeout'

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

    it('should return the FIRST matching Session Timeout, if one of a User\'s Roles matches that Session Timeout\'s pattern.', () => {

      const roles = [
        'pui-organisation-manager',
        'pui-case-manager',
      ]

      const roleGroupSessionTimeouts = [
        {
          idleModalDisplayTime: 5,
          pattern: 'pui-',
          totalIdleTime: 50,
        },
        {
          idleModalDisplayTime: 2,
          pattern: '.',
          totalIdleTime: 12,
        },
      ]

      const usersSessionTimeout = getUserSessionTimeout(roles, roleGroupSessionTimeouts);

      expect(usersSessionTimeout).to.equal(roleGroupSessionTimeouts[0])
    })

    it('should return the LAST matching Session Timeout, if there is NO User Role\'s that matches the pattern ie.' +
      'return the DEFAULT Session Timeout.', () => {

      const DEFAULT_SESSION_TIMEOUT = [{
        idleModalDisplayTime: 2,
        pattern: '.',
        totalIdleTime: 12,
      }]

      const roles = [
        'pui-organisation-manager',
        'pui-case-manager',
        'pui-finance-manager',
      ]

      const roleGroupSessionTimeouts = [
        {
          idleModalDisplayTime: 5,
          pattern: 'doesnotmatch',
          totalIdleTime: 50,
        },
        // The last item is the default so that we can easily configure the default as IT will change on Go Live.
        ...DEFAULT_SESSION_TIMEOUT,
      ]

      expect(getUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(DEFAULT_SESSION_TIMEOUT[0])
    })

    it('should return the SECOND matching Session Timeout, if the Session Timeout pattern DOES NOT match' +
      'the FIRST Session Timeout pattern.', () => {

      const roles = [
        'pui-organisation-manager',
      ]

      const roleGroupSessionTimeouts = [
        {
          idleModalDisplayTime: 5,
          pattern: 'doesnotmatch',
          totalIdleTime: 50,
        },
        {
          idleModalDisplayTime: 10,
          pattern: 'organisation',
          totalIdleTime: 80,
        },
        {
          idleModalDisplayTime: 2,
          pattern: '.',
          totalIdleTime: 12,
        },
      ]

      expect(getUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(roleGroupSessionTimeouts[1])
    })

    it('should return the DEFAULT_SESSION_TIMEOUT if the XUI team accidentally sets an incorrect default pattern.', () => {

      const roles = [
        'pui-organisation-manager',
      ]

      const roleGroupSessionTimeouts = [{
        idleModalDisplayTime: 6,
        pattern: 'a-non-descript-pattern',
        totalIdleTime: 60,
      }]

      expect(getUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(DEFAULT_SESSION_TIMEOUT)
    })

    it('should return the DEFAULT_SESSION_TIMEOUT if the XUI team accidentally does not set a DEFAULT Session Timeout via the' +
      'configuration.', () => {

      const roles = [
        'pui-organisation-manager',
      ]

      const roleGroupSessionTimeouts = []

      expect(getUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(DEFAULT_SESSION_TIMEOUT)
    })

    /**
     * The following should never happen but the production code should be resilient to this edge case.
     */
    it('should return the DEFAULT_SESSION_TIMEOUT if there are no User Roles.', () => {

      const roles = []

      const roleGroupSessionTimeouts = [
        {
          idleModalDisplayTime: 10,
          pattern: 'organisation',
          totalIdleTime: 80,
        },
      ]

      expect(getUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(DEFAULT_SESSION_TIMEOUT)
    })

    it('should give preference to Session Timeout patterns in a priority order. A pattern nearer to the top of the list is' +
      'higher priority.', () => {

      // Roles are sorted by sortUserRoles() which is a side effect within getUserSessionTimeout(), but we are
      // showing the sorted roles here, as it's easier to understand what happens.
      const roles = [
        'caseworker',
        'caseworker-divorce-financialremedy',
        'caseworker-divorce-solicitor',
        'caseworker-probate',
        'caseworker-probate-solicitor',
        'pui-user-manager',
        'pui-finance-manager',
      ]

      const roleGroupSessionTimeouts = [
        {
          idleModalDisplayTime: 10,
          pattern: 'pui-user-manager',
          totalIdleTime: 80,
        },
        {
          idleModalDisplayTime: 20,
          pattern: 'caseworker-probate',
          totalIdleTime: 200,
        },
      ]

      expect(getUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(roleGroupSessionTimeouts[0])
    })
  })

  /**
   * Should sort the User's Roles alphabetically. Why? So that a priority order can be given to the Session Timeout +
   * configuration list.
   *
   * Example: If we want a PUI Session Timeout to be given preference over another Session Timeout it would be further
   * up the Session Timeout Configuration list.
   */
  describe('sortRolesAlphabetically()', () => {
    it('should sort the User\'s Roles alphabetically, so that a priority order can be given to the Session Timeout' +
      'configuration list.', () => {

      const roles = [
        'caseworker-divorce-financialremedy',
        'pui-user-manager',
        'pui-case-manager',
        'caseworker-probate-solicitor',
        'caseworker',
        'caseworker-probate',
        'caseworker-divorce-financialremedy-solicitor',
        'caseworker-divorce',
        'pui-organisation-manager',
        'pui-finance-manager',
        'caseworker-divorce-solicitor',
      ]

      const sortedRoles = roles.sort()

      expect(sortUserRoles(roles)).to.equal(sortedRoles)
    })
  });
})
