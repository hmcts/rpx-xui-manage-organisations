import { application } from './application.config'

import * as local from './environments/local.config'
import * as laat from './environments/laat.config'
import * as docker from './environments/docker.config'
import * as spreview from './environments/spreview.config'
import * as saat from './environments/saat.config'
import * as sprod from './environments/sprod.config'
import * as preview from './environments/preview.config'
import * as demo from './environments/demo.config'
import * as aat from './environments/aat.config'
import * as prod from './environments/prod.config'
import * as mock from './environments/mock.config'
import * as process from 'process'

const configs = {
    aat,
    demo,
    docker,
    idam_client: 'juiwebapp',
    laat,
    local,
    microservice: 'jui_webapp',
    mock,
    oauth_callback_url: 'oauth2/callback',
    preview,
    prod,
    protocol: 'https',
    saat,
    spreview,
    sprod,
}

export const configEnv = process ? process.env.PUI_ENV || 'local' : 'local'
export const config = { ...application, ...configs[configEnv].default }

export default { ...config }

if (process) {
    config.appInsightsInstrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY || 'AAAAAAAAAAAAAAAA'
}

if (configEnv === 'local') {
    config.protocol = 'http'
}
