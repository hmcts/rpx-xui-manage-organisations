import {Component, Input} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { HmctsIdentityBarState } from 'src/app/store/reducers/hmcts-identity-bar.reducer';

@Component({
    selector: 'app-hmcts-identity-bar',
    templateUrl: './hmcts-identity-bar.component.html',
    styleUrls: ['./hmcts-identity-bar.component.scss']
})
export class HmctsIdentityBarComponent {

    @Input() value: string;

    barState: any;

    constructor(
        private store: Store<HmctsIdentityBarState>
     ) {
        this.barState = store.pipe(select('hmctsIdentityBarReducer'));
        console.log(this.barState);
    }

}
