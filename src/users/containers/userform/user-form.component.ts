import {Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';

import {checkboxesBeCheckedValidator} from '../../../custom-validators/checkboxes-be-checked.validator';
import {dateValidator} from '../../../custom-validators/date.validator';
import {Observable} from 'rxjs';



@Component({
  selector: 'app-prd-user-form-component',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {

  constructor(private store: Store<fromStore.UserState>) { }
  isSubmitted = false;
  inviteUserForm: FormGroup;
  formValidationErrors$: Observable<any>

  ngOnInit(): void {
    this.formValidationErrors$ = this.store.pipe(select(fromStore.getGetInviteUserList));

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
      }, checkboxesBeCheckedValidator()),
      // date: new FormGroup({
      //   day: new FormControl('', Validators.pattern('[0-9]*')),
      //   month: new FormControl('', Validators.pattern('[0-9]*')),
      //   year: new FormControl('')
      // }, dateValidator())
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.inviteUserForm.controls; }

  onSubmit() {
    this.isSubmitted = true;
    this.dispatchValidationAction();
    if (this.inviteUserForm.valid) {
      const {value} = this.inviteUserForm;
      this.store.dispatch(new fromStore.InviteUser(value));
    }
  }

  dispatchValidationAction() {
    const formValidation = {
      isInvalid: {
        firstName: (this.f.firstName.errors && this.f.firstName.errors.required),
        lastName: (this.f.lastName.errors && this.f.lastName.errors.required),
        emailAddress: (this.f.emailAddress.errors && this.f.emailAddress.errors.required),
        emailAddressEmail: (this.f.emailAddress.errors && this.f.emailAddress.errors.email),
        permissions: (this.f.permissions.errors && this.f.permissions.errors.requireOneCheckboxToBeChecked),
        // date: (this.f.date.errors && this.f.date.errors.dateIsInvalid)
      }
    };
    this.store.dispatch(new fromStore.UpdateErrorMessages(formValidation))

    console.log(this.f)

  }


}

