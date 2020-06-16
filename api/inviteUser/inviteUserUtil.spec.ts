import { expect } from 'chai'
import { getInviteUserUrl } from './inviteUserUtil'

describe('inviteuser util', () => {
    it('should getInviteUserUrl', () => {
        let url = getInviteUserUrl('http://base')
        expect(url).to.equal('http://base/refdata/external/v1/organisations/users/')

        url = getInviteUserUrl('http://base')
        expect(url).to.equal('http://base/refdata/external/v1/organisations/users/')
    })
})
