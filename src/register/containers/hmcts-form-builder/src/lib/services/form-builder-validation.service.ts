import { Injectable } from '@angular/core';
import { Validators, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ControlsisTextAreaValidWhenCheckboxChecked, FormGroupValidator } from './form-group-validation.typescript';
import { CustomValidatorsService } from './form-builder-custom-validators.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor(private readonly datePipe: DatePipe, private readonly customValidatorService: CustomValidatorsService) { }

  // FOR SINGLE CONTROLS - formGroup.control level validation
  /**
   * Custom validators can be added to this.
   *
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
    {
      simpleName: 'pbaNumberFormat',
      ngValidatorFunction: this.customValidatorService.pbaNumbersCustomValidator()
    }
  ];

  /**
   * Returns a map of how we've mapped simple names to Ng Validators, and in the future custom validators.
   *
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
   * @param formGroup - the formGroup to be evaluated.
   * @param validationErrorId - ie. 'reasonsConstentOrderNotApproved' - This is the validation identifier
   * we assign to a group of form controls, we assign this when we currently setValidators(), note that we will
   * need to pass this in once the Universal Form Builder is merged with Validation.
   * @return boolean - Whether the formGroup is invalid or not.
   */
  isFormGroupInvalid(formGroup: any, validationErrorId: string): boolean {
    if (formGroup.errors?.hasOwnProperty(validationErrorId)) {
      return formGroup.errors[validationErrorId];
    }
    return null;
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
    return (controls: FormGroup): ValidationErrors | null => {
      for (const checkbox of checkboxes) {
        if (controls.get(checkbox).value === true) {
          return null;
        }
      }

      return {
        [validationIdentifier]: true
      };
    };
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
    return (controls: FormGroup): ValidationErrors | null => {
      return this.isAllFieldsRequiredValidationFn(controls, fields, validationIdentifier);
    };
  }

  /** Common function for date validator
   * Returninng the validationIdentifier true if invalid and null if valid
   *
   * yyyy/mm/dd
   *
   */

  isValidDateValidationFn(
    controls: FormGroup,
    fields: string[],
    validationIdentifier: string
  ): { [key: string]: boolean } | null {
    if (!controls || !fields) {
      return null;
    }

    const dateValues = this.getDateValues(controls, fields);

    if (!dateValues || !this.isValidDateParts(dateValues)) {
      return {
        [validationIdentifier]: true
      };
    }

    return this.isRealDate(dateValues)
      ? null
      : { [validationIdentifier]: true };
  }

  private getDateValues(
    controls: FormGroup,
    fields: string[]
  ): string[] | null {
    const dateValues: string[] = [];

    for (const field of fields) {
      const value = controls.get(field)?.value;

      if (!value || !this.hasValidDatePartLength(value)) {
        return null;
      }

      dateValues.push(value);
    }

    return dateValues.length === 3 ? dateValues : null;
  }

  private hasValidDatePartLength(value: string): boolean {
    return value.length <= 2 || value.length === 4;
  }

  private isValidDateParts(dateValues: string[]): boolean {
    const [year, month, day] = dateValues;

    return this.isNumeric(year)
      && this.isNumeric(month)
      && this.isNumeric(day)
      && Number(month) > 0
      && Number(month) <= 12
      && Number(day) > 0
      && Number(day) <= 31;
  }

  private isNumeric(value: string): boolean {
    return !Number.isNaN(Number(value));
  }

  private isRealDate(dateValues: string[]): boolean {
    const [year, month, day] = dateValues;
    const formattedDate = `${year},${this.padDatePart(month)},${this.padDatePart(day)}`;
    const dateObj = new Date(formattedDate);
    const checkDateStr = dateObj
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, ',');

    return checkDateStr === formattedDate;
  }

  private padDatePart(value: string): string {
    return Number(value) < 10 ? `0${Number(value)}` : value;
  }

  isValidDate(formGroup: FormGroup, fields: Array<string>, validationIdentifier: string): ValidatorFn | null {
    return (controls: FormGroup): ValidationErrors | null => {
      return this.isValidDateValidationFn(controls, fields, validationIdentifier);
    };
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

  isTextAreaValidWhenCheckboxChecked(formGroup: FormGroup, controls: ControlsisTextAreaValidWhenCheckboxChecked, validationIdentifier: string) {
    const isTextAreaValidWhenCheckboxChecked: ValidatorFn = (formControls: FormGroup): ValidationErrors | null => {
      if (!formControls.get(controls.checkboxControl).value) {
        return null;
      }

      if (formControls.get(controls.textareaControl).value && formControls.get(controls.textareaControl).value.length > 0) {
        return null;
      }

      return {
        [validationIdentifier]: true
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
            return this[option.childValidator.validatorFunc + 'ValidationFn'](null, null, option.childValidator.validationErrorId);
          }

          return null;
        }
        if (option.childValidator.validatorFunc) {
          return this[option.childValidator.validatorFunc + 'ValidationFn'](formGroup, option.childValidator.controls, option.childValidator.validationErrorId);
        }
      }

      return {
        [validationIdentifier]: true
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
   * @param formGroup - Angular FormGroup
   * @param formGroupValidators - [{
   *    validatorFunc: 'isAnyCheckboxChecked',
   *    validationErrorId: 'reasonsConstentOrderNotApproved',
   *    checkboxes: [
   *        'partiesNeedAttend', 'NotEnoughInformation', 'orderNotAppearOfS25ca1973', 'd81',
   *        'pensionAnnex', 'applicantTakenAdvice', 'respondentTakenAdvice', 'Other2'
   *    ]}]
   */
  createFormGroupValidators(formGroup: FormGroup, formGroupValidators) {
    return formGroupValidators.map((formGroupValidator) => {
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
   * @param formGroup the Angular formGroup
   * @param validatorFunc - i.e. 'isAnyCheckboxChecked'
   * @param controls - ['partiesNeedAttend', 'NotEnoughInformation'] or { checkbox: 'controlName', textarea: 'controlName' }
   * @param validationErrorId - i.e. 'reasonsConsentOrderNotApproved'
   *
   * @return ValidatorFn - the validation function defined in the generic pattern
   */
  createFormGroupValidator(formGroup: FormGroup, validatorFunc: string, controls: any, validationErrorId: string): ValidatorFn {
    return this[validatorFunc](formGroup, controls, validationErrorId);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public invalidPBANumberCheck(formGroup: FormGroup, controlName: string, validationErrorId: string): ValidatorFn | null {
    return (fg: FormGroup): ValidationErrors | null => {
      return this.invalidPBANumberValidatorFn(fg, controlName);
    };
  }

  public invalidPBANumberValidatorFn(fg: FormGroup, controlName: string) {
    if (fg.controls) {
      for (const key of Object.keys(fg.controls)) {
        if (key.startsWith(controlName) && key.includes(controlName)
          && fg.controls[key].errors && !fg.controls[key].errors.hasOwnProperty('duplicatedPBAError')) {
          return {
            invalidPBANumberError: true
          };
        }
      }
    }
    return null;
  }

  public duplicatedPBACheck(formGroup: FormGroup, controlName: string, validationErrorId: string): ValidatorFn | null {
    return (fg: FormGroup): ValidationErrors | null => {
      return this.duplicatedPBAValidatorFn(fg, controlName, validationErrorId);
    };
  }

  public duplicatedPBAValidatorFn(
    formGroup: FormGroup,
    controlName: string,
    validationIdentifier: string
  ): { [key: string]: boolean } | null {
    if (!formGroup || !controlName) {
      return null;
    }

    const originalControls = this.getControlsWithValues(formGroup, controlName);
    const duplicatedControls = this.getDuplicatedControls(originalControls);

    if (Object.keys(duplicatedControls).length > 0) {
      this.setDuplicateErrors(formGroup, duplicatedControls, validationIdentifier);

      return {
        [validationIdentifier]: true
      };
    }

    this.clearDuplicateErrors(formGroup, controlName, validationIdentifier);
    return null;
  }

  private getControlsWithValues(
    formGroup: FormGroup,
    controlName: string
  ): Record<string, unknown> {
    return Object.keys(formGroup.controls)
      .filter((key) => key.startsWith(controlName))
      .filter((key) => Boolean(formGroup.controls[key].value))
      .reduce((controls, key) => {
        controls[key] = formGroup.controls[key].value;
        return controls;
      }, {} as Record<string, unknown>);
  }

  private getDuplicatedControls(
    controls: Record<string, unknown>
  ): Record<string, unknown> {
    const duplicatedControls: Record<string, unknown> = {};
    const keys = Object.keys(controls);

    keys.forEach((key, index) => {
      keys.slice(index + 1).forEach((keyToCompare) => {
        if (controls[key] === controls[keyToCompare]) {
          duplicatedControls[key] = controls[key];
          duplicatedControls[keyToCompare] = controls[keyToCompare];
        }
      });
    });

    return duplicatedControls;
  }

  private setDuplicateErrors(
    formGroup: FormGroup,
    duplicatedControls: Record<string, unknown>,
    validationIdentifier: string
  ): void {
    Object.keys(duplicatedControls).forEach((key) => {
      formGroup.controls[key]?.setErrors({
        [validationIdentifier]: true
      });
    });
  }

  private clearDuplicateErrors(
    formGroup: FormGroup,
    controlName: string,
    validationIdentifier: string
  ): void {
    Object.keys(formGroup.controls)
      .filter((key) => key.includes(controlName))
      .forEach((key) => {
        const control = formGroup.controls[key];

        if (control?.errors?.[validationIdentifier]) {
          control.setErrors(null);
        }
      });
  }
}
