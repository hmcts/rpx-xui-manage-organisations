import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-hmcts-sub-navigation',
    templateUrl: './hmcts-sub-navigation.component.html',
    styleUrls: ['./hmcts-sub-navigation.component.scss']
})
export class HmctsSubNavigationComponent {

    @Input() label: string;
    @Input() items: Array<SubNavigation>;

    constructor() { }

}

export interface SubNavigation {
    text: string;
    href: string;
    active: boolean;
}

