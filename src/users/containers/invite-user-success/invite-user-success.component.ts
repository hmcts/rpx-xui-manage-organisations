import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';

@Component({
    selector: 'app-invite-user-success',
    templateUrl: './invite-user-success.component.html'
})
export class InviteUserSuccessComponent implements OnInit {

    constructor(private store: Store<fromStore.UserState>) { }

    ngOnInit() {
        this.store.dispatch(new fromStore.Reset());
    }

}
