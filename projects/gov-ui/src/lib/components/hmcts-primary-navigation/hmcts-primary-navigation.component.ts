import {Component, EventEmitter, Input, Output} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-hmcts-primary-navigation',
    templateUrl: './hmcts-primary-navigation.component.html',
    styleUrls: ['./hmcts-primary-navigation.component.scss']
})
export class HmctsPrimaryNavigationComponent {

    @Input() set userLoggedIn(value) {
        this.userValue = value;
    }

    @Input()
    label = 'Primary navigation'
    @Input()
    items = [
        {
            text: 'Nav item 1',
            href: '#1',
            active: true
        },
        {
            text: 'Nav item 2',
            href: '#2'
        },
        {
            text: 'Nav item 3',
            href: '#3'
        }
    ]

    userValue: any
    constructor(private route: ActivatedRoute) {

    }

}
