import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-hmcts-identity-bar',
    templateUrl: './hmcts-identity-bar.component.html',
    styleUrls: ['./hmcts-identity-bar.component.scss']
})
export class HmctsIdentityBarComponent {

    @Input() value: string;

    constructor() { }

}
