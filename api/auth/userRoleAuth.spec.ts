import {expect} from 'chai'
import {
  hasManageOrganisationRole,
  hasPuiCaseManagerRole,
  MANAGE_ORGANISATION_ROLES,
  PUI_CASE_MANAGER,
  userHasAppAccess
} from './userRoleAuth'

describe('userRoleAuthentication', () => {

  it('Should return true if a User has a Pui Case Manager Role and a Manage Organisation role.', () => {

    const roles = [
      'pui-case-manager',
      'pui-user-manager',
      'caseworker',
    ]

    expect(userHasAppAccess(roles)).to.be.true
  })

  it('Should return false if a User only has a Pui Case Manager Role.', () => {

    const roles = [
      'pui-case-manager',
      'caseworker',
    ]

    expect(userHasAppAccess(roles)).to.be.false
  })

  it('Should return false if a User only has a Manage Organisation Role.', () => {

    const roles = [
      'pui-user-manager',
    ]

    expect(userHasAppAccess(roles)).to.be.false
  })

  it('Should return false if a User only has no roles.', () => {

    const roles = []

    expect(userHasAppAccess(roles)).to.be.false
  })

  it('Should return true if there is a \'pui-case-manager\' role.', () => {

    const roles = [
      'pui-case-manager',
      'caseworker',
    ]

    expect(hasPuiCaseManagerRole(roles)).to.be.true
  })

  it('Should return false if there is no \'pui-case-manager\' role.', () => {

    const roles = [
      'caseworker',
    ]

    expect(hasPuiCaseManagerRole(roles)).to.be.false
  })

  /**
   * If the User has a Manage Organisation role, and a Pui Case Manager role
   * then we should allow the User access to the Manage Organisations application.
   */
  it('Should return true if there is a Manage Organisation role, as part of a User\'s roles.', () => {

    const roles = [
      'caseworker',
      'pui-organisation-manager',
    ]

    const manageOrganisationRoles = [
      'pui-organisation-manager',
      'pui-user-manager',
      'pui-finance-manager',
    ]

    expect(hasManageOrganisationRole(roles, manageOrganisationRoles)).to.be.true
  })

  it('Should return false if there is no Manage Organisation role, as part of a User\'s roles.', () => {

    const roles = [
      'caseworker',
    ]

    const manageOrganisationRoles = [
      'pui-organisation-manager',
      'pui-user-manager',
      'pui-finance-manager',
    ]

    expect(hasManageOrganisationRole(roles, manageOrganisationRoles)).to.be.false
  })

  it('Should have the correct Manage Organisation Roles', () => {
    expect(MANAGE_ORGANISATION_ROLES).to.be.deep.equal([
      'pui-organisation-manager',
      'pui-user-manager',
      'pui-finance-manager',
    ])
  })

  it('Should have the correct Pui Case Manager Role', () => {
    expect(PUI_CASE_MANAGER).to.be.deep.equal([
      'pui-case-manager',
    ])
  })
})
