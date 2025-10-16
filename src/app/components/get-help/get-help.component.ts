import { Component } from '@angular/core';
import { ContactDetailsDataModel } from '@hmcts/rpx-xui-common-lib';
import { AppConstants } from '../../app.constants';

@Component({
    selector: 'app-get-help',
    templateUrl: './get-help.component.html',
    standalone: false
})
export class GetHelpComponent {
  public getHelpData: ContactDetailsDataModel[] = AppConstants.GET_HELP_DETAILS_DATA;
}
