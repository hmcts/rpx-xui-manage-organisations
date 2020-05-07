import { expect } from 'chai'
import { anyRolesMatch, calcUserSessionTimeout, DEFAULT_SESSION_IDLE_TIME, isRoleMatch} from './userTimeout'


// TODO: What is idle time?
describe('userTimeout', () => {
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
  it('should return the Idle Time of a User based on their User roles, and the ' +
    'User Role group settings.', () => {

    const roles = [
      'pui-organisation-manager',
      'pui-user-manager',
      'pui-finance-manager',
    ]

    // Note that the default is the last item in this array.
    const roleGroupSessionTimeouts = [
      {
        idleTime: 43200, // idle time in seconds
        userRolePattern: 'pui-', // takes in regEx so you can set this to be DwPensions.
      },
      {
        idleTime: 180000, // idle time in seconds
        userRolePattern: '.', // takes in regEx so you can set this to be DwPensions.
      },
    ]

    expect(calcUserSessionTimeout(roles, roleGroupSessionTimeouts)).to.equal(false)
  })
})
