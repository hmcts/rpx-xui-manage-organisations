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
  selector: 'app-prd-user-form-component',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {

  constructor(private store: Store<fromStore.UserState>) { }
  inviteUserForm: FormGroup;

  formValidationErrors$: Observable<any>;
  formValidationErrorsArray$: Observable<{isFromValid: boolean; items: { id: string; message: any; }[]}>

  errorMessages = {
    firstName: ['Enter first name'],
    lastName: ['Enter last name'],
    emailAddress: ['Enter email address', 'Email must contain at least the @ character'],
    permissions: ['Select at least one option'],
  }

  ngOnInit(): void {

    this.formValidationErrors$ = this.store.pipe(select(fromStore.getGetInviteUserErrorMessage));
    this.formValidationErrorsArray$ = this.store.pipe(select(fromStore.getGetInviteUserErrorsArray));

    this.inviteUserForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      emailAddress: new FormControl('', [Validators.email, Validators.required]),
      permissions: new FormGroup({
        createCases: new FormControl(''),
        viewCases: new FormControl(''),
        manageUsers: new FormControl(''),
        viewDetails: new FormControl(''),
        viewFees: new FormControl('')
      }, checkboxesBeCheckedValidator())
    });

  }

  // convenience getter for easy access to form fields
  get f() { return this.inviteUserForm.controls; }

  onSubmit() {
    this.dispatchValidationAction();
    if (this.inviteUserForm.valid) {
      const {value} = this.inviteUserForm;
      this.store.dispatch(new fromStore.InviteUser(value));
    }
  }

  dispatchValidationAction() {
    // set form errors
    const formValidationData = {
      isInvalid: {
        firstName: [(this.f.firstName.errors && this.f.firstName.errors.required)],
        lastName: [(this.f.lastName.errors && this.f.lastName.errors.required)],
        emailAddress: [
          (this.f.emailAddress.errors && this.f.emailAddress.errors.required),
          (this.f.emailAddress.errors && this.f.emailAddress.errors.email),
        ],
        permissions: [(this.f.permissions.errors && this.f.permissions.errors.requireOneCheckboxToBeChecked)],
      },
      errorMessages: this.errorMessages,
      isSubmitted: true
    };
    this.store.dispatch(new fromStore.UpdateErrorMessages(formValidationData));


  }


}

