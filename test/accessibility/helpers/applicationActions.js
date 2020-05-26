

const PallyActions = require('./pallyActions');
const {conf} = require('../config/config');


class ManageOrgPallyActions {


    idamLogin(username, password) {
        return [
            ...PallyActions.waitForPageWithCssLocator('#username'),
            ...PallyActions.inputField('#username',username),
            ...PallyActions.inputField('#password', password),
            ...PallyActions.clickElement('input.button')

        ];
    }

    fillAndSubmitInviteUsers(firstname,lastname,email){
        return [
            ...PallyActions.waitForPageWithCssLocator('input#firstName'),
            ...PallyActions.inputField('input#firstName', firstname),
            ...PallyActions.inputField('input#lastName', lastname),
            ...PallyActions.inputField('input#email', email),
            ...PallyActions.clickElement('input#pui-organisation-manager'),
            ...PallyActions.clickElement('form>button')
        ];
    }

    waitForInviteuserSuccess(){
        return [
            ...PallyActions.waitForurl(conf.baseUrl+'users/invite-user-success')
        ]
    }

    waitForInviteUserError(){
        return [
            ...PallyActions.waitForPageWithCssLocator('.govuk-error-summary__title')
        ]
    }

}

module.exports = new ManageOrgPallyActions();