import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-invite-user-success',
    templateUrl: './invite-user-success.component.html'
})
export class InviteUserSuccessComponent implements OnInit, OnDestroy {

    userEmail$: Observable<string>;

    constructor(private store: Store<fromStore.UserState>) { }

    ngOnInit() {
        this.userEmail$ = this.store.pipe(select(fromStore.getInviteUserEmail));
    }

    ngOnDestroy(): void {
        this.store.dispatch(new fromStore.Reset());
    }
}
