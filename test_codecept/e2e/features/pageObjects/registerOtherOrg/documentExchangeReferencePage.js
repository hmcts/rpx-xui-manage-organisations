

class DocumentExchangeReferencePage {

    constructor() {
        this.container = $('app-document-exchange-reference')

        this.radioYes = $('#document-exchange-yes')
        this.radioNo = $('#document-exchange-no')


        this.fieldMapping = {
            'Do you have a document exchange reference for your main office?': $("input[name='documentExchange']")
        }
    }

    async inputValue(field, value) {
        switch (field) {
            case 'Do you have a document exchange reference for your main office?':
                if(value.toLowerCase().trim().includes('yes')){
                    await this.radioYes.click()
                }else{
                    await this.radioNo.click()
                }
                break;
        
            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }


}

module.exports = DocumentExchangeReferencePage 

