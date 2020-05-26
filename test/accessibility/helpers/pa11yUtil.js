

const pa11y = require('pa11y');
const assert = require('assert');


async function pa11ytest(test,actions) {

    let result = await pa11y('manage-org.aat.platform.hmcts.net', {
        // log: {
        //     debug: console.log,
        //     error: console.error,
        //     info: console.info
        // },
        actions: actions
    });
    test.a11yResult = result;
    assert(result.issues.length === 0, "accessibility issues reported") 
    return result;
    // const htmlResults = await html.results(result);

}

function getResults(){

    return results; 
}

module.exports = { pa11ytest, getResults}
