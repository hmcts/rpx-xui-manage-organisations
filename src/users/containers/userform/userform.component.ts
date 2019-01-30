import { Component, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store';
import { Observable } from 'rxjs';




@Component({
  selector: 'app-prd-userform-component',
  templateUrl: './userform.component.html',
})
export class UserformComponent implements OnInit {


  constructor(private store: Store<fromStore.UserformState>) { }



  ngOnInit(): void {
  }

  onSubmit(value) {
    this.store.dispatch(new fromStore.SaveUser(value));

  }

}

