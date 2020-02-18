import { expect } from 'chai'
import { getTermsAndConditionsUrl } from './termsAndConditionsUtil'

describe('terms And Conditions ', () => {
    it('should getTermsAndConditionsUrl', () => {
        const url = getTermsAndConditionsUrl('http://base', 'xuiwebapp')
        expect(url).to.equal('http://base/api/v1/termsAndConditions/xuiwebapp/documents')
    })
})
