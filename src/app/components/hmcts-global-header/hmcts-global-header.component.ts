import { Component, EventEmitter, Input, Output } from '@angular/core';
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
}
