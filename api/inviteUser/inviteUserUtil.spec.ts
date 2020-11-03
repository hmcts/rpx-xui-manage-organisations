import { expect } from 'chai'
import { getRefdataUserUrl } from './inviteUserUtil'

describe('inviteuser util', () => {
    it('should getInviteUserUrl', () => {
        let url = getRefdataUserUrl('http://base')
        expect(url).to.equal('http://base/refdata/external/v1/organisations/users/')

        url = getRefdataUserUrl('http://base')
        expect(url).to.equal('http://base/refdata/external/v1/organisations/users/')
    })
})
