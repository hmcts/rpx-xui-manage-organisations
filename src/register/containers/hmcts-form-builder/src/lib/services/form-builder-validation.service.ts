import {Injectable} from '@angular/core';
import {AbstractControl, Form, FormGroup} from '@angular/forms';
import {Validators, ValidationErrors, ValidatorFn} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {controlsisTextAreaValidWhenCheckboxChecked, controlsRadioConditionalModel, FormGroupValidator} from './form-group-validation.typescript';
import { CustomValidatorsService } from './form-builder-custom-validators.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private datePipe: DatePipe, private customValidatorService: CustomValidatorsService) {
  }

  // FOR SINGLE CONTROLS - formGroup.control level validation
  /**
   * Custom validators can be added to this.
   *
   * TODO : Define interface for array.
   *
   * @see https://angular.io/guide/form-validation#custom-validators
   */
  ngValidatorFunctionMap: Array<any> = [
    {
      simpleName: 'required',
      ngValidatorFunction: Validators.required
    },
    {
      simpleName: 'email',
      ngValidatorFunction: Validators.email
    },
    {
      simpleName: 'dxNumberExactLength',
      ngValidatorFunction: this.customValidatorService.exactLengthValidator(13)
    },
    {
      simpleName: 'dxNumberMaxLength',
      ngValidatorFunction: Validators.maxLength(13)
    },
    {
      simpleName: 'dxExchangeMaxLength',
      ngValidatorFunction: Validators.maxLength(20)
    },
    {
      simpleName: 'pbaNumberPattern',
      ngValidatorFunction: Validators.pattern(/(PBA\w*)/i)
    },
    {
      simpleName: 'pbaNumberMaxLength',
      ngValidatorFunction: Validators.maxLength(10)
    },
    {
      simpleName: 'pbaNumberMinLength',
      ngValidatorFunction: Validators.minLength(10)
    },
  ];

  /**
   * Returns a map of how we've mapped simple names to Ng Validators, and in the future custom validators.
   *
   * TODO: Check return in Unit test.
   *
   * // @returnArray
   */
  getNgValidationFunctionMap() {
    return this.ngValidatorFunctionMap;
  }

  /**
   * Takes in an array of simple validation names.
   *
   * These names map to Ng Validation functions, and can map to more complex custom validation functions.
   *
   * This allows us to leverage the power of Ng Validation, and custom validation, as well as giving us
   * the ability to create reusable validators, that can be used throughout our forms.
   *
   * Note: Validators.minLength requires Validators.required
   *
   * TODO: Unit test.
   *
   * @see state_meta
   * // @param validators - ie. ['required', 'email']
   */
  getNgValidators(validators: Array<string>): any[] {

    const ngValidators: Array<any> = [];

    validators.forEach((validatorName) => {
      for (const ngValidatorFunction of this.getNgValidationFunctionMap()) {
        if (ngValidatorFunction.simpleName === validatorName) {
          ngValidators.push(ngValidatorFunction.ngValidatorFunction);
        }
      }
    });

    return ngValidators;
  }

  /**
   * Checks if validators have been set on the control, an example of a validator being set on a control is:
   *
   * {
     *  control: 'informationNeeded',
     *  value: 'Information text',
     *  validators: ['required']
     * }
   *
   * TODO: Unit test.
   *
   * //@param {Array} validators - ['required']
   * //@return {boolean}
   */
  controlHasValidation(validators: Array<string>): boolean {

    return validators && validators.length > 0;
  }

  /**
   * Checks if the control is valid.
   *
   * Returns a boolean, based on if the control which is part
   * of a form group is valid or not.
   *
   * TODO: Unit test.
   *
   * // @param {FormGroup} formGroup
   * // @param {String} control - 'informationNeeded'
   * // @return {boolean}
   */
  isFormControlValid(formGroup: FormGroup, control: string): boolean {

    return formGroup.get(control).valid;
  }

  // FOR MULTIPLY CONTROLS - formGroup level validation.
  /**
   * Is Form Group Invalid
   *
   * Checks if a validation error has been thrown on the pages Angular FormGroup.
   *
   * FormGroup is a the parent of FormControls, and therefore and according to the Angular
   * Docs the best place to validate against multiply controls, that have dependencies upon one
   * another is on the FormGroup level.
   *
   * An example being; we should check if a user has checked one of eight checkboxes.
   *
   * TODO : Unit Test
   *
   * @see ValidationService
   * // @param {FormGroup} formGroup
   * // @param {string} validationErrorId - ie. 'reasonsConstentOrderNotApproved' - This is the validation identifier
   * we assign to a group of form controls, we assign this when we currently setValidators(), note that we will
   * need to pass this in once the Universal Form Builder is merged with Validation.
   * // @return{boolean}
   */
  isFormGroupInvalid(formGroup: any, validationErrorId: string): boolean {
    if (formGroup.errors && formGroup.errors.hasOwnProperty(validationErrorId)) {
      return formGroup.errors[validationErrorId];
    } else {
      return null;
    }
  }

  /**
   * isAnyCheckboxChecked
   *
   * Checks if any of the checkbox controls passed to this function are checked ie. have a boolean value
   * of true.
   *
   * This is due to the fact that we might have multiply checkboxes within the view, and the user needs to
   * select at least one of these checkboxes to have entered a valid input.
   *
   * Note that we validate on the formGroup level, and not the control level for this as we are concerned with
   * multiple controls and the Ng 6 way is to have the validator on a common ancestor of controls; in this
   * case our formGroup.
   *
   * If the user has checked a checked box this function returns null and therefore no validation error is returned.
   * If the user has NOT checked a checkbox this function returns a validation error.
   *
   * // @param formGroup
   * // @param {string} validationIdentifier - An error name assigned by the developer, this name can then be referred
   * to display the error in the  view.
   * // @return{any}
   */
  isAnyCheckboxChecked(formGroup: FormGroup, checkboxes: Array<string>, validationIdentifier: string): ValidatorFn | null {
    const isAnyCheckboxCheckedValidationFn: ValidatorFn = (controls: FormGroup): ValidationErrors | null => {

      for (const checkbox of checkboxes) {
        if (controls.get(checkbox).value === true) {
          return null;
        }
      }

      return {
        [validationIdentifier]: true,
      };
    };

    return isAnyCheckboxCheckedValidationFn;
  }


  // Common function for validator
  // Returninng the validationIdentifier true if invalid and null if valid

  isAllFieldsRequiredValidationFn(controls: FormGroup, fields: Array<string>, validationIdentifier) {
    if (controls !== null && fields !== null) {
      for (const field of fields) {
        if (!controls.get(field).value) {
          return {
            [validationIdentifier]: true
          };
        }
      }
    }

    return null;
  }

  /**
   * isAllFieldsRequired
   *
   * // @param formGroup
   * // @param controls is object
   * // @param validationIdentifier
   * // @return{any}
   */

  isAllFieldsRequired(formGroup: FormGroup, fields: Array<string>, validationIdentifier: string): ValidatorFn | null {
    const isAllFieldsRequiredValidationFn: ValidatorFn = (controls: FormGroup): ValidationErrors | null => {
      return this.isAllFieldsRequiredValidationFn(controls, fields, validationIdentifier);
    };
    return isAllFieldsRequiredValidationFn;
  }

  /** Common function for date validator
   * Returninng the validationIdentifier true if invalid and null if valid
   *
   * yyyy/mm/dd
   *
   */


  isValidDateValidationFn(controls: FormGroup, fields: Array<string>, validationIdentifier) {

    if (controls !== null && fields !== null) {
      const dateValueArray = [];

      for (const field of fields) {

        if (!controls.get(field).value) {
          return {
            [validationIdentifier]: true
          };
        } else {

          // Form have valid values and we can create date
          // Check is form controls matching the right lengh and then create array contained date

          if (controls.get(field).value.length <= 2) {
            dateValueArray.push(controls.get(field).value);
          } else if  (controls.get(field).value.length === 4) {
            dateValueArray.push(controls.get(field).value);
          } else {
            return {
              [validationIdentifier]: true
            };
          }

          // Check if array is ready and convert to string

          if (dateValueArray.length === 3) {

            // Return error if not numbers
            for (const element of dateValueArray) {
              if (element != Number(element)) {
                return {
                  [validationIdentifier]: true
                };
              }
            }

            // Convert user entered day and month to numbers
            dateValueArray[1] = Number(dateValueArray[1]);
            dateValueArray[2] = Number(dateValueArray[2]);

            // Return error if user entered months less than 0 and more than 12
            if (dateValueArray[1] <= 0 || dateValueArray[1] >= 12) {
              return {
                [validationIdentifier]: true
              };
            }
            // Return error if user entered months less than 0 and more than 31
            if (dateValueArray[2] <= 0 || dateValueArray[2] >= 31) {
              return {
                [validationIdentifier]: true
              };
            }

            // Here value might me invalid

            // Adding zeros in front if less than 10
            if (dateValueArray[1] < 10) { dateValueArray[1] = ('0' + (dateValueArray[1]).toString().slice(-2)); }
            if (dateValueArray[2] < 10) { dateValueArray[2] = ('0' + (dateValueArray[2]).toString().slice(-2)); }

            // Get proper date format by create Date object and convert it back to string for comparison with what the user entered

            const dateStr = dateValueArray.toString();

            const dateObj = new Date(dateStr);
            const checkDateStr = dateObj.toISOString().slice(0, 10).replace(/-/g, ',').replace('T', ' ');

            // Return null if valid date
            if (checkDateStr === dateStr) {
              return null;
            }

            return {
              [validationIdentifier]: true
            };

          }
        }
      }
    }

    return null;
  }

  isValidDate(formGroup: FormGroup, fields: Array<string>, validationIdentifier: string): ValidatorFn | null {
    const isValidDateValidationFn: ValidatorFn = (controls: FormGroup): ValidationErrors | null => {
      return this.isValidDateValidationFn(controls, fields, validationIdentifier);
    };

    return isValidDateValidationFn;
  }

  /**
   * isTextAreaValidWhenCheckboxChecked
   *
   * // @param formGroup
   * // @param controls is object
   * { checkboxControl : string, textareaControl : string }
   * // @param validationIdentifier
   * //@return {any}
   */

  isTextAreaValidWhenCheckboxChecked(formGroup: FormGroup, controls: controlsisTextAreaValidWhenCheckboxChecked, validationIdentifier: string) {


    const isTextAreaValidWhenCheckboxChecked: ValidatorFn = (formControls: FormGroup): ValidationErrors | null => {

      if (!formControls.get(controls.checkboxControl).value) {
        return null;
      }

      if (formControls.get(controls.textareaControl).value && formControls.get(controls.textareaControl).value.length > 0) {
        return null;
      }

      return {
        [validationIdentifier]: true,
      };
    };

    return isTextAreaValidWhenCheckboxChecked;
  }

  /**
   * isRadioValidWhenSomeOptionSelected
   *
   * // @param formGroup
   * // @param controls is object
   * { checkboxControl : string, textareaControl : string }
   * // @param validationIdentifier
   * // @return {any}
   */

  isRadioValidWhenSomeOptionSelected(formGroup: FormGroup, controls: any, validationIdentifier: string) {

    const isRadioValidWhenSomeOptionSelected: ValidatorFn = (formControls: FormGroup): ValidationErrors | null => {

      for (const option of controls.selectedOptions) {
        if (formControls.get(controls.radioControl).value !== null && formControls.get(controls.radioControl).value !== option.selectedOption) {

          // Do not validate child if parent is valid so
          // Reset child validation to valid state here
          // Add word "ValidationFn" to the name of validator when you extend child validation functions

          if (option.childValidator.validatorFunc) {
            return  this[option.childValidator.validatorFunc + "ValidationFn"](null, null, option.childValidator.validationErrorId);
          }

          return null;

        } else {
          if (option.childValidator.validatorFunc){
            return this[option.childValidator.validatorFunc + "ValidationFn"](formGroup, option.childValidator.controls, option.childValidator.validationErrorId);
          }
        }
      }

      return {
        [validationIdentifier]: true,
      };

    };

    return isRadioValidWhenSomeOptionSelected;
  }

  /**
   * createFormGroupValidators
   *
   * FormGroup Validators are used for validation that involves more than one FormControl. ie. When a control
   * depends on another, or we need to validate a group of controls together. Validation for multiply controls is
   * required on the common ancestor as per the Angular Documentation.
   *
   * @see @see https://angular.io/guide/form-validation#adding-to-reactive-forms-1
   *
   * // @param {FormGroup} formGroup - Angular FormGroup
   * // @param formGroupValidators - [{
     *    validatorFunc: 'isAnyCheckboxChecked',
     *    validationErrorId: 'reasonsConstentOrderNotApproved',
     *    checkboxes: [
     *        'partiesNeedAttend', 'NotEnoughInformation', 'orderNotAppearOfS25ca1973', 'd81',
     *        'pensionAnnex', 'applicantTakenAdvice', 'respondentTakenAdvice', 'Other2'
     *    ]}]
   */
  createFormGroupValidators(formGroup: FormGroup, formGroupValidators) {

    return formGroupValidators.map(formGroupValidator => {

      const groupValidator: FormGroupValidator = formGroupValidator;
      return this.createFormGroupValidator(formGroup, groupValidator.validatorFunc, groupValidator.controls,
        groupValidator.validationErrorId);
    });
  }

  /**
   * createFormGroupValidator
   *
   * You'll need to pass in the name of the validator function that you wish to use.
   *
   * @see state_meta.js
   *
   * // @param formGroup
   * // @param {String} validatorFunc - 'isAnyCheckboxChecked'
   * // @param {Array or Object} controls - ['partiesNeedAttend', 'NotEnoughInformation'] or { checkbox: 'controlName', textarea: 'controlName' }
   * // @param {String} validationErrorId - 'reasonsConstentOrderNotApproved'
   *
   * // @return {ValidatorFn}
   */
  createFormGroupValidator(formGroup: FormGroup, validatorFunc: string, controls: any, validationErrorId: string): ValidatorFn {

    return this[validatorFunc](formGroup, controls, validationErrorId);
  }

  invalidPBANumberCheck(formGroup: FormGroup, controlName: string, validationErrorId: string): ValidatorFn | null {
    const invalidPBANumberValidatorFn: ValidatorFn = (fg: FormGroup): ValidationErrors | null => {
      if (fg.controls) {
        for (const key of Object.keys(fg.controls)) {
          if (key.startsWith(controlName) && key.includes(controlName)
            && fg.controls[key].errors && !fg.controls[key].errors.hasOwnProperty('duplicatedPBAError')) {
            return {
              invalidPBANumberError: true
            };
          }
        };
      }
      return null;
    };
    return invalidPBANumberValidatorFn;
  }

  duplicatedPBACheck(formGroup: FormGroup, controlName: string, validationErrorId: string): ValidatorFn | null {
    const duplicatedPBAValidatorFn: ValidatorFn = (fg: FormGroup): ValidationErrors | null => {
      return this.duplicatedPBAValidatorFn(fg, controlName, validationErrorId);
    };

    return duplicatedPBAValidatorFn;
  }

  duplicatedPBAValidatorFn(formGroup: FormGroup, controlName: string, validationIdentifier: string) {
    const originalControls = {};
    const duplicatedControls = {};
    if (formGroup && controlName) {
      for (const key of Object.keys(formGroup.controls)) {
        if (key.startsWith(controlName) && key.includes(controlName) && formGroup.controls[key].value) {
            originalControls[key] = formGroup.controls[key].value;
        }
      };
      const controlsToCompare = {...originalControls};
      for (const key of Object.keys(originalControls)) {
        for (const keyToCompare of Object.keys(controlsToCompare)) {
          if (key !== keyToCompare && originalControls[key] === controlsToCompare[keyToCompare]) {
            duplicatedControls[key] = originalControls[key];
            duplicatedControls[keyToCompare] = controlsToCompare[keyToCompare];
          }
        }
      }
      if (Object.keys(duplicatedControls).length > 0) {
        // return Object.keys(duplicatedControls);
        for (const key of Object.keys(duplicatedControls)) {
          if (formGroup.controls.hasOwnProperty(key)) {
            formGroup.controls[key].setErrors({
              [validationIdentifier]: true
            });
          }
        }
        return {
          [validationIdentifier]: true
        };
      } else {
        for (const key of Object.keys(formGroup.controls)) {
          if (key.includes(controlName) && formGroup.controls[key]
            && formGroup.controls[key].errors && formGroup.controls[key].errors.hasOwnProperty('duplicatedPBAError')) {
            formGroup.controls[key].setErrors(null);
          }
        }
      }
    }
    return null;
  }

}
