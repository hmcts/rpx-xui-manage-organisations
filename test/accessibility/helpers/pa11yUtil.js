

const pa11y = require('pa11y');
const html = require('pa11y-reporter-html')


const results = [];
async function pa11ytest(actions) {

    console.log(actions);
    let result = await pa11y('manage-org.aat.platform.hmcts.net', {
        log: {
            debug: console.log,
            error: console.error,
            info: console.info
        },
        actions: actions
    });
    results.push(result);
    console.log(result);
    return result;
    // const htmlResults = await html.results(result);

}

function getResults(){

    return results; 
}

module.exports = { pa11ytest, getResults}
