import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-hmcts-identity-bar',
    templateUrl: './hmcts-identity-bar.component.html',
    styleUrls: ['./hmcts-identity-bar.component.scss']
})
export class HmctsIdentityBarComponent {

    @Input() set content(value) {
        this.value = value.name;
    }

    value: string;

    constructor() { }
}
