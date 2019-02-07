import { Component, Input } from '@angular/core';
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

    @Input() serviceName = {
        name: 'Service name',
        url: '#'
    };
    @Input() navigation = {
        label: 'Account navigation',
        items: [
            {
                text: 'Nav item 1',
                href: '#1'
            }, {
                text: 'Nav item 2',
                href: '#1'
            }
        ]
    };

    userValue: any;
    constructor(public store: Store<fromRoot.State>) { }



}
