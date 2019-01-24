import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store';
import { Observable } from 'rxjs';
import { debug } from 'util';



/**
 * Bootstraps the Register Components
 */

@Component({
  selector: 'app-prd-users-component',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {

  constructor(
    private store: Store<fromStore.UserState>
  ) { }


  ngOnInit(): void {
    this.store.dispatch(new fromStore.LoadUsers());
    this.store.pipe(select(fromStore.getGetUserArray)).subscribe(userData => {
      console.log(userData);
    })
  }



  // dispatch load action

  // subscribe to a selector
}

