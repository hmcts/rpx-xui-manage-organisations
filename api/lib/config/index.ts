import { application } from './application.config';

import * as process from 'process';
import * as aat from './environments/aat.config';
import * as demo from './environments/demo.config';
import * as docker from './environments/docker.config';
import * as ldocker from './environments/ldocker.config';
import * as local from './environments/local.config';
import * as mock from './environments/mock.config';
import * as preview from './environments/preview.config';
import * as prod from './environments/prod.config';
import * as saat from './environments/saat.config';
import * as spreview from './environments/spreview.config';
import * as sprod from './environments/sprod.config';

const configs = {
    aat,
    demo,
    docker,
    ldocker,
    local,
    mock,
    preview,
    prod,
    saat,
    spreview,
    sprod,
};

export const configEnv = process ? process.env.PUI_ENV || 'local' : 'local';
export const config = { ...application, ...configs[configEnv].default };

export default { ...config };

if (process) {
    config.appInsightsInstrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY || 'AAAAAAAAAAAAAAAA';
}

if (configEnv === 'local') {
    config.protocol = 'http';
}
