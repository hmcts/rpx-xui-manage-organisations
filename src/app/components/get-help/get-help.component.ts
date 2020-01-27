import { Component } from '@angular/core';
import { ContactDetailsDataModel } from '@hmcts/rpx-xui-common-lib';
import { AppConstants } from 'src/app/app.constants';

@Component({
    selector: 'app-get-help',
    templateUrl: './get-help.component.html'
})
export class GetHelpComponent {

    public getHelpData: ContactDetailsDataModel[] = AppConstants.GET_HELP_DETAILS_DATA;

    constructor() {
    }
}
