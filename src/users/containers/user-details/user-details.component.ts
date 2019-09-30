import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store';
import {Observable} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {map} from 'rxjs/internal/operators';

@Component({
  selector: 'app-prd-user-details-component',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  userData$: Observable<any>; // TODO add type

  constructor(
    private activeRoute: ActivatedRoute,
    private store: Store<fromStore.UserState>
  ) { }

  ngOnInit(): void {
    this.activeRoute.parent.params.pipe(
      map(payload => {
        this.userData$ = this.store.pipe(select(fromStore.getGetSingleUser, { userIdentifier: payload.userId }));
      })
    ).subscribe();

  }

}

