import { expect } from 'chai'
import { postUserTermsAndConditionsUrl } from './termsAndConditionsUtil'

describe('terms And Conditions ', () => {
    it('should postUserTermsAndConditionsUrl', () => {
        const url = postUserTermsAndConditionsUrl('http://base', 'xuiwebapp')
        expect(url).to.equal('http://base/api/v1/termsAndConditions/xuiwebapp/users/accept/version')
    })
})
