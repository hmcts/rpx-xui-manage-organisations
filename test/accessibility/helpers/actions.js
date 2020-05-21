class Actions{
    idamLogin(username,password){
        return [
            'wait for element #username to be visible',
            'set field #username to ' + username,
            'set field #password to ' + password,
            'click element input.button'
        ];
    }

    waitForurl(url){
        return ['wait for url to be '+url];

    }

    navigateTourl(url) {
        return ['navigate to '+url,'wait for url to be ' + url];

    }

    waitForPageWithCssLocator(cssLocator) {
        return ['wait for element ' + cssLocator+' to be visible'];

    }

    inputField(cssLocator,inputText) {
        return ['set field ' + cssLocator+' to ' + inputText];

    }

    clickElement(cssLocator) {
        return ['click element ' + cssLocator ];

    }

}

module.exports = new Actions();

