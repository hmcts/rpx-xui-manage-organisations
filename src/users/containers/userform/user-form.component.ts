import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromStore from '../../store';



@Component({
  selector: 'app-prd-user-form-component',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {

  constructor(private store: Store<fromStore.UserState>) { }
  displayFormErrors = false;

  ngOnInit(): void {}

  onSubmit(formData) {
    this.displayFormErrors = !formData.valid;
    console.log(formData.touched)
    if (formData.valid) {
      const {value} = formData;
      this.store.dispatch(new fromStore.InviteUser(value));
    }
  }

}

