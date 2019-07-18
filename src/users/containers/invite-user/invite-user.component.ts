import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';

import {checkboxesBeCheckedValidator} from '../../../custom-validators/checkboxes-be-checked.validator';
import {Observable} from 'rxjs';

/*
* User Form entry mediator component
* It holds the state
* */

@Component({
  selector: 'app-prd-invite-user-component',
  templateUrl: './invite-user.component.html',
})
export class InviteUserComponent implements OnInit {

  constructor(private store: Store<fromStore.UserState>) { }
  inviteUserForm: FormGroup;

  errors$: Observable<any>;
  errorsArray$: Observable<{ isFromValid: boolean; items: { id: string; message: any; } []}>;

  errorMessages = {
    firstName: ['Enter first name'],
    lastName: ['Enter last name'],
    email: ['Enter email address', 'Email must contain at least the @ character'],
    roles: ['Select at least one option'],
  };

  ngOnInit(): void {
    alert(2);
    this.errors$ = this.store.pipe(select(fromStore.getInviteUserErrorMessage));
    this.errorsArray$ = this.store.pipe(select(fromStore.getGetInviteUserErrorsArray));

    this.inviteUserForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
      roles: new FormGroup({
        manageCases: new FormControl(''),
        manageUsers: new FormControl(''),
        manageOrg: new FormControl('')
      }, checkboxesBeCheckedValidator())
    });

  }

  // convenience getter for easy access to form fields
  get f() { return this.inviteUserForm.controls; }

  onSubmit() {
    this.dispatchValidationAction();
    if (this.inviteUserForm.valid) {
      let {value} = this.inviteUserForm;
      const permissions = Object.keys(value.roles).map(key => key);
      value = {
        ...value,
        roles: permissions,
        status: 'pending'
      };
      this.store.dispatch(new fromStore.SendInviteUser(value));
    }
  }

  dispatchValidationAction() {
    // set form errors
    const formValidationData = {
      isInvalid: {
        firstName: [(this.f.firstName.errors && this.f.firstName.errors.required)],
        lastName: [(this.f.lastName.errors && this.f.lastName.errors.required)],
        email: [
          (this.f.email.errors && this.f.email.errors.required),
          (this.f.email.errors && this.f.email.errors.email),
        ],
        roles: [(this.f.roles.errors && this.f.roles.errors.requireOneCheckboxToBeChecked)],
      },
      errorMessages: this.errorMessages,
      isSubmitted: true
    };
    this.store.dispatch(new fromStore.UpdateErrorMessages(formValidationData));


  }


}
