const jenkinsConfig = [

    {
        browserName: 'chrome',
        acceptInsecureCerts: true,
        nogui: true,
        unexpectedAlertBehaviour: 'accept',
        chromeOptions: { args: ['--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-zygote ', '--disableChecks', '--disable-notifications'] }
    }
];

const localConfig = [
    {
        browserName: 'chrome',
        acceptInsecureCerts: true,
        unexpectedAlertBehaviour: 'accept',
        chromeOptions: { args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-zygote ', '--disable-notifications'] },
        proxy: {
            proxyType: 'manual',
            httpProxy: 'proxyout.reform.hmcts.net:8080',
            sslProxy: 'proxyout.reform.hmcts.net:8080',
            noProxy: 'localhost:3000'
        }
    }
];

const config = {
    config : {
        baseUrl: process.env.TEST_URL || 'http://localhost:3000/' 
    }
    
};

module.exports = { localConfig, jenkinsConfig, config}