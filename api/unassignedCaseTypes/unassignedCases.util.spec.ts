import { expect } from 'chai'
import { getApiPath, searchCasesString } from './unassignedCases.util'

describe('util', () => {
    it('getApiPath', () => {
        const fullPath = getApiPath('http://somePath')
        expect(fullPath).to.equal(`http://somePath${searchCasesString}`)
    })
})
