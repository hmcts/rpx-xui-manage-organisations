import { expect } from 'chai'
import { getRefdataUserUrl } from './refdataUserUrlUtil'

describe('refdata user URL util', () => {
    it('should getRefdataUserUrl', () => {
        let url = getRefdataUserUrl('http://base')
        expect(url).to.equal('http://base/refdata/external/v1/organisations/users/')

        url = getRefdataUserUrl('http://base')
        expect(url).to.equal('http://base/refdata/external/v1/organisations/users/')
    })
})
