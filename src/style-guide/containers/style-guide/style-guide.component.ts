import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';

import {checkboxesBeCheckedValidator} from '../../../custom-validators/checkboxes-be-checked.validator';
import {Observable} from 'rxjs';
import {dateValidator} from '../../../custom-validators/date.validator';
import {StyleGuideFormDataModel} from '../../models/style-guide-form-data.model';

import {StyleGuideFormConstants as CONST} from '../../constants/style-guide-form.constants';

/*
* Style Guide Mediator Component
* It holds the state
* */

@Component({
  selector: 'app-prd-user-form-component',
  templateUrl: './style-guide.component.html',
})
export class StyleGuideComponent implements OnInit {

  constructor(private store: Store<fromStore.UserState>) { }
  styleGuideForm: FormGroup;

  formValidationErrors$: Observable<any>;
  formValidationErrorsArray$: Observable<{isFromValid: boolean; items: { id: string; message: any; }[]}>;

  errorMessages: StyleGuideFormDataModel = {
    [CONST.STG_FORM_MODEL.input]: ['Enter first name', 'Email must contain at least the @ character'],
    [CONST.STG_FORM_MODEL.checkboxes]: ['Select at least one option'],
    [CONST.STG_FORM_MODEL.passport]: ['Please enter valid date'],
    [CONST.STG_FORM_MODEL.contactPreference]: ['Select one option'],
    [CONST.STG_FORM_MODEL.sortBy]: ['Please select at least one option'],
    [CONST.STG_FORM_MODEL.moreDetails]: ['Please provide more details']
  };

  ngOnInit(): void {
    this.formValidationErrors$ = this.store.pipe(select(fromStore.getStyleGuideErrorMessage));
    this.formValidationErrorsArray$ = this.store.pipe(select(fromStore.getGetStyleGuideErrorsArray));
    // TODO add type
    this.styleGuideForm = new FormGroup({
      [CONST.STG_FORM_MODEL.input]: new FormControl('', [Validators.required, Validators.email]),
      [CONST.STG_FORM_MODEL.checkboxes]: new FormGroup({ // checkboxes
        createCases: new FormControl(''),
        viewCases: new FormControl(''),
      }, checkboxesBeCheckedValidator()),
      [CONST.STG_FORM_MODEL.contactPreference]: new FormControl('', Validators.required),
      [CONST.STG_FORM_MODEL.passport]: new FormGroup({ // date
        day: new FormControl(''),
        month: new FormControl(''),
        year: new FormControl('')
      }, dateValidator()),
      [CONST.STG_FORM_MODEL.sortBy]: new FormControl('', Validators.required),
      [CONST.STG_FORM_MODEL.moreDetails]: new FormControl('', Validators.required)
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.styleGuideForm.controls; }

  onSubmit() {
    this.dispatchValidation();
    // this is where the form values would get dispatched
    // const {value} = this.styleGuideForm;
  }

  dispatchValidation() {
    /*
    * bind form errors to an object
    * to be used later to display error messages
    * what normally is done by default in Angular when observable binding is used.
    * */
    const formValidationData = {
      isInvalid: {
        [CONST.STG_FORM_MODEL.input]: [
          (this.f[CONST.STG_FORM_MODEL.input].errors && this.f[CONST.STG_FORM_MODEL.input].errors.required),
          (this.f[CONST.STG_FORM_MODEL.input].errors && this.f[CONST.STG_FORM_MODEL.input].errors.email)
        ],

        [CONST.STG_FORM_MODEL.checkboxes]: [(this.f[CONST.STG_FORM_MODEL.checkboxes].errors &&
          this.f[CONST.STG_FORM_MODEL.checkboxes].errors.requireOneCheckboxToBeChecked)],

        [CONST.STG_FORM_MODEL.passport]: [(this.f[CONST.STG_FORM_MODEL.passport].errors &&
          this.f[CONST.STG_FORM_MODEL.passport].errors.dateIsInvalid)],

        [CONST.STG_FORM_MODEL.contactPreference]: [(this.f[CONST.STG_FORM_MODEL.contactPreference].errors &&
          this.f[CONST.STG_FORM_MODEL.contactPreference].errors.required)],

        [CONST.STG_FORM_MODEL.sortBy]: [(this.f[CONST.STG_FORM_MODEL.sortBy].errors &&
          this.f[CONST.STG_FORM_MODEL.sortBy].errors.required)],

        [CONST.STG_FORM_MODEL.moreDetails]: [(this.f[CONST.STG_FORM_MODEL.moreDetails].errors &&
          this.f[CONST.STG_FORM_MODEL.moreDetails].errors.required)]
      },
      errorMessages: this.errorMessages,
      isSubmitted: true
    };
    this.store.dispatch(new fromStore.UpdateErrorMessages(formValidationData));
  }


}

