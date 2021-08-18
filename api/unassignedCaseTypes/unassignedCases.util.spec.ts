import { expect } from 'chai'
import { searchCasesString } from './unassignedCaseTypes-constants'
import { getApiPath } from './unassignedCaseTypes.util'

describe('util', () => {
    it('getApiPath', () => {
        const fullPath = getApiPath('http://somePath', 'case1')
        expect(fullPath).to.equal(`http://somePath${searchCasesString}case1`)
    })
})
