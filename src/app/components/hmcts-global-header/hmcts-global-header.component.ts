import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-hmcts-global-header',
    templateUrl: './hmcts-global-header.component.html'
})
export class HmctsGlobalHeaderComponent {
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

    constructor() { }

}
