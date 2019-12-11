import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as fromRoot from '../../store';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-hmcts-global-header',
    templateUrl: './hmcts-global-header.component.html'
})
export class HmctsGlobalHeaderComponent {

    @Input() set userLoggedIn(value) {
        this.userValue = value;
    }
    @Input() headerTitle: { name: string; url: string };
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
