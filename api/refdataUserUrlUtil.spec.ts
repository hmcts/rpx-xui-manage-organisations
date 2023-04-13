import { expect } from 'chai'
import { getRefdataUserUrl } from './refdataUserUrlUtil'

describe('refdata user URL util', () => {
    it('should getRefdataUserUrl', () => {
        let url = getRefdataUserUrl('http://base', '0')
        expect(url).to.equal('http://base/refdata/external/v1/organisations/users?size=50&page=0')

        url = getRefdataUserUrl('http://base', '1')
        expect(url).to.equal('http://base/refdata/external/v1/organisations/users?size=50&page=1')
    })
})
