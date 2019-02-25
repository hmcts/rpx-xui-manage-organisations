import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromStore from '../../store';



@Component({
  selector: 'app-prd-userform-component',
  templateUrl: './userform.component.html',
})
export class UserformComponent implements OnInit {


  constructor(private store: Store<fromStore.UserState>) { }



  ngOnInit(): void {
  }

  onSubmit(value) {
    this.store.dispatch(new fromStore.InviteUser(value));

  }

}

