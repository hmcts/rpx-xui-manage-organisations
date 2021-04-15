import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppTitlesModel } from '../../../app/models/app-titles.model';
import * as fromRoot from '../../store';

@Component({
    selector: 'app-hmcts-global-header',
    templateUrl: './hmcts-global-header.component.html',
    styleUrls: ['./hmcts-global-header.component.scss']
})
export class HmctsGlobalHeaderComponent {

    @Input() set userLoggedIn(value) {
        this.userValue = value;
    }
    @Input() headerTitle: AppTitlesModel;
    @Input() navigation;
    @Input() isBrandedHeader: boolean;
    @Output() navigate = new EventEmitter<string>();
    @Input() showHeaderItems: boolean;

    userValue: any;
    constructor(public store: Store<fromRoot.State>) { }

    onEmitEvent(index) {
        this.navigate.emit(this.navigation.items[index].emit);
    }
}
