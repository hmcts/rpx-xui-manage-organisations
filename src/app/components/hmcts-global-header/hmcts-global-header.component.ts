import { Component, Input } from '@angular/core';
import * as fromRoot from '../../store';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-hmcts-global-header',
    templateUrl: './hmcts-global-header.component.html'
})
export class HmctsGlobalHeaderComponent {

    @Input() set userLoggedIn(value) {
        this.userValue = value; // TODO add type
    }
    @Input() serviceName;
    @Input() navigation;

    userValue: any;
    constructor(public store: Store<fromRoot.State>) { }



}
