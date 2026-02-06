import { Component } from '@angular/core';
import { ContactDetailsDataModel } from '@hmcts/rpx-xui-common-lib';
import { AppConstants } from '../../app.constants';
import { buildCompositeTrackKey } from 'src/shared/utils/track-by.util';

@Component({
  selector: 'app-get-help',
  templateUrl: './get-help.component.html',
  standalone: false
})
export class GetHelpComponent {
  public getHelpData: ContactDetailsDataModel[] = AppConstants.GET_HELP_DETAILS_DATA;

  public trackByHelpItem(index: number, item: ContactDetailsDataModel): string | number {
    return buildCompositeTrackKey(index, item?.title, item?.email);
  }
}
