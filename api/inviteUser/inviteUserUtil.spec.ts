import { expect } from 'chai'
import { getInviteUserUrl, getReinviteString } from './inviteUserUtil'

describe('terms And Conditions ', () => {
    it('should getInviteUserUrl', () => {
        let url = getInviteUserUrl('http://base', 'userReinvite')
        expect(url).to.equal('http://base/refdata/external/v1/organisations/users/userReinvite')

        url = getInviteUserUrl('http://base', '')
        expect(url).to.equal('http://base/refdata/external/v1/organisations/users/')
    })

    it('should getReinviteString', () => {
        let resendinviteStr = getReinviteString({isReinvite: true})
        expect(resendinviteStr).to.equal('resendinvite')

        resendinviteStr = getReinviteString(null)
        expect(resendinviteStr).to.equal('')
    })
})
