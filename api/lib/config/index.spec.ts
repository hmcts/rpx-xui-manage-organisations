import * as assert from 'assert'
import * as nodeProcess from 'process'
import * as environments from './index'

xdescribe('environments', () => {
    let process: NodeJS.Process

    beforeEach(() => {
        process = nodeProcess
    })

    it('should create the configuration for the given environment', () => {
        process.env.PUI_ENV = 'mock'
        process.env.APPINSIGHTS_INSTRUMENTATIONKEY = 'abc123'
        const configuration = environments.default

        // configuration.process = nodeProcess
        console.log(configuration.process)
        console.log(configuration)
        console.log(configuration.config)
        assert.equal(configuration.config.appInsightsInstrumentationKey, 'abc123')
    })
})
