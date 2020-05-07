import { expect } from 'chai'
import { anyRolesMatch, calcUserSessionTimeout, DEFAULT_SESSION_IDLE_TIME, isRoleMatch} from './userTimeout'

// TODO: What is idle time?
describe('userTimeout', () => {

  const DEFAULT_IDLE_TIME = 180000

  xit('should return the default time out of 12 minutes if there is an empty array input, as ' +
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

  /**
   * Note I deceided not to use Reg Ex here, as we just require simple string matching.
   *
   * TODO: Remove the word Reg Ex.
   *
   * Boolean(role.match(new Reg Ex('')))
   */
  describe('isRoleMatch()', () => {

    it('should return true if there is a match of the User\'s role to the Reg Ex pattern so' +
      'that the App knows that we need to have a specific Idle Time for that User Group.', () => {
      expect(isRoleMatch('pui-case-manager', 'case-')).to.be.true
    })

    it('should return true if there is a partial match of the User\'s role to the Reg Ex pattern.', () => {
      expect(isRoleMatch('pui-case-manager', 'pui')).to.be.true
    })

    it('should return false if there is no match of the User\'s role to the Reg Ex pattern.', () => {
      expect(isRoleMatch('pui-case-manager', 'dwp-')).to.be.false
    })

    // TODO: This should help us define all others
    it('should return true for a wildcard Reg Ex pattern.', () => {
      expect(isRoleMatch('pui', '.')).to.be.true
    })
  })

  describe('anyRolesMatch()', () => {
    it('should return true if any of the Users roles match a Reg Ex pattern.', () => {

      const roles = [
        'pui-organisation-manager',
        'pui-user-manager',
        'pui-finance-manager',
      ]

      expect(anyRolesMatch(roles, 'user-manager')).to.be.true
    })

    // Testing a Reg Ex ( Might be able to be removed if we can just use .includes )
    it('should return true if any of the Users roles match a Reg Ex pattern.', () => {

      const roles = [
        'pui-organisation-manager',
        'pui-user-manager',
        'pui-finance-manager',
      ]

      expect(anyRolesMatch(roles, '.')).to.be.true
    })

    it('should return false if none of the Users roles match a Reg Ex pattern.', () => {

      const roles = [
        'pui-organisation-manager',
        'pui-user-manager',
        'pui-finance-manager',
      ]

      expect(anyRolesMatch(roles, 'dwp')).to.be.false
    })
  })

  // Note that the group setting refers to DWP having a timeout of 12 minutes
  // the rest having a timeout of 50, and the requirement
  // that these should be easily configurable.

  describe('anyRolesMatch()', () => {
    /**
     * The session timeouts array is in priority order ie. The first Idle Time will be used
     * if the Regular Expression matches a role.
     *
     * If the first Idle Time out is not used then the second is tried to see if
     * the pattern matches any Role the User may have.
     *
     * This goes on until, the final pattern which is the default timeout time.
     */
    it('should return the FIRST matching Idle Time from the Session Timeouts, if the User Role matches the pattern.', () => {

      const roles = [
        'pui-organisation-manager',
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

      expect(calcUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(roleGroupSessionTimeouts[0].idleTime)
    })

    it('should return the FIRST matching Idle Time from the Session Timeouts, if the User Role matches the pattern. (More complex roles list)', () => {

      const roles = [
        'pui-organisation-manager',
        'pui-case-manager',
      ]

      const roleGroupSessionTimeouts = [
        {
          idleTime: 43200,
          pattern: 'pui-case-manager',
        },
        {
          idleTime: DEFAULT_IDLE_TIME,
          pattern: '.',
        },
      ]

      expect(calcUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(roleGroupSessionTimeouts[0].idleTime)
    })

    it('should return the LAST matching Idle Time from the Session Timeouts, if there is NO User Role that matches the pattern ie.' +
      'the Default.', () => {

      const roles = [
        'pui-organisation-manager',
      ]

      const roleGroupSessionTimeouts = [
        {
          idleTime: 43200,
          pattern: 'doesnotmatch',
        },
        {
          idleTime: DEFAULT_IDLE_TIME,
          pattern: '.',
        },
      ]

      expect(calcUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(DEFAULT_IDLE_TIME)
    })

    it('should return the LAST matching Idle Time from the Session Timeouts, if there is NO User Role that matches the pattern ie.' +
      'the Default. ( More complex roles and timeout list )', () => {

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
        {
          idleTime: 60000,
          pattern: 'seconddoesnotmatch',
        },
        {
          idleTime: DEFAULT_IDLE_TIME,
          pattern: '.',
        },
      ]

      expect(calcUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(DEFAULT_IDLE_TIME)
    })

    it('should return the SECOND matching Idle Time from the Session Timeouts, if the Session Timeout pattern DOES NOT match' +
      'the FIRST Session Timeout role.', () => {

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
          idleTime: DEFAULT_IDLE_TIME,
          pattern: '.',
        },
      ]

      expect(calcUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(roleGroupSessionTimeouts[1].idleTime)
    })

    it('should return the DEFAULT_SESSION_IDLE_TIME if someone accidentally does not set a default session idle time via' +
      'configuration.', () => {

      const roles = [
        'pui-organisation-manager',
      ]

      const roleGroupSessionTimeouts = []

      expect(calcUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(DEFAULT_SESSION_IDLE_TIME)
    })

    it('should return the DEFAULT_SESSION_IDLE_TIME if there are no User Roles.', () => {

      const roles = []

      const roleGroupSessionTimeouts = [
        {
          idleTime: 43200,
          pattern: 'doesnotmatch',
        },
      ]

      expect(calcUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(DEFAULT_SESSION_IDLE_TIME)
    })
  })
})
