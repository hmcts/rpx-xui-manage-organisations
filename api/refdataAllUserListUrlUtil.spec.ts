import { expect } from 'chai'
import { getRefdataAllUserListUrl } from './refdataAllUserListUrlUtil'

describe('refdata all user list without roles URL util', () => {
    it('should getRefdataAllUserListUrl', () => {
        let url = getRefdataAllUserListUrl('http://base')
        expect(url).to.equal('http://base/refdata/external/v1/organisations/users?returnRoles=false')

        url = getRefdataAllUserListUrl('http://base')
        expect(url).to.equal('http://base/refdata/external/v1/organisations/users?returnRoles=false')
    })
})
