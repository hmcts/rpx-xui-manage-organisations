import {Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';
import {requireCheckboxesToBeCheckedValidator} from '../../../custom-validators/require-checkboxes-to-be-checked-validator';



@Component({
  selector: 'app-prd-user-form-component',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {

  constructor(private store: Store<fromStore.UserState>) { }
  isSubmitted = false;
  inviteUserForm: FormGroup;
  isInvalid: {
    firstName: boolean,
    lastName: boolean,
    emailAddress: boolean;
    emailAddressEmail: boolean,
    permissions: boolean
  };


  ngOnInit(): void {
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
      }, requireCheckboxesToBeCheckedValidator())
    });
    this.validate();
  }

  // convenience getter for easy access to form fields
  get f() { return this.inviteUserForm.controls; }

  onSubmit() {
    this.isSubmitted = true;
    this.validate();
    if (this.inviteUserForm.valid) {
      const {value} = this.inviteUserForm;
      this.store.dispatch(new fromStore.InviteUser(value));
    }
  }

  validate() {
    this.isInvalid = {
      firstName: (this.f.firstName.errors && this.f.firstName.errors.required),
      lastName: (this.f.lastName.errors && this.f.lastName.errors.required),
      emailAddress: (this.f.emailAddress.errors && this.f.emailAddress.errors.required),
      emailAddressEmail: (this.f.emailAddress.errors && this.f.emailAddress.errors.email),
      permissions: (this.f.permissions.errors && this.f.permissions.errors.requireOneCheckboxToBeChecked)
    }
  }


}

