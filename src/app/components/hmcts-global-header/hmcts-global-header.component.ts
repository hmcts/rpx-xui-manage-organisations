import { Component, EventEmitter, Input, Output } from '@angular/core';
import { buildIdOrIndexKey } from 'src/shared/utils/track-by.util';
import { Store } from '@ngrx/store';

import { AppTitlesModel } from '../../../app/models/app-titles.model';
import * as fromRoot from '../../store';

@Component({
  selector: 'app-hmcts-global-header',
  templateUrl: './hmcts-global-header.component.html',
  styleUrls: ['./hmcts-global-header.component.scss'],
  standalone: false
})
export class HmctsGlobalHeaderComponent {
    @Input() public set userLoggedIn(value) {
    this.userValue = value;
  }

    @Input() public headerTitle: AppTitlesModel;
    @Input() public navigation;
    @Input() public isBrandedHeader: boolean;
    @Output() public navigate = new EventEmitter<string>();
    @Input() public showHeaderItems: boolean;

    public userValue: any;
    constructor(public store: Store<fromRoot.State>) {}

    public onEmitEvent(index) {
      this.navigate.emit(this.navigation.items[index].emit);
    }

    // Provide stable identity for navigation items to avoid NG0956 DOM churn
    public trackByNavItem(index: number, item: any): string | number {
      return buildIdOrIndexKey(index, item, 'id', 'href', 'text');
    }
}
