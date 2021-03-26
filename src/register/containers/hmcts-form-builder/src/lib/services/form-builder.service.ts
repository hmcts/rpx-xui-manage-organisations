import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from './form-builder-validation.service';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  public formControls = [];

  constructor(private validationService: ValidationService) {
  }

  /**
   * Creation of FormControls for a FormGroup.
   * So first thing is how do we add Validation to a FormControl
   *
   * prop can be a fieldset, legend, text, idPrefix, name, header, checkboxes, if we
   *
   * Here is where the validation is applied to each of the controls of the form, based on the validators that
   * have been plaed into the state_meta.js.
   *
   * TODO: Name this something totally different, as create doesn't really explain what it does,
   * also there it's quite hard to work out.
   *
   * @param someJson - The JSON template to be rendered as form control
   * @param someData - The default data value of the form control
   */
  public create(someJson, someData) {
    if (someJson && typeof someJson === 'object') {
      for (const prop of Object.keys(someJson)) {
        if (prop === 'control') {
          if (someJson.radioGroup !== undefined) {
            // RadioButton Logic
            if (Object.keys(someData).length !== 0) {
              for (const radioEl of someJson.radioGroup) {
                if (radioEl.value === someData[someJson.control]) {
                  this.formControls[someJson.control] = new FormControl(radioEl.value);
                  break;
                } else {
                  this.createFormControl(null, someJson.control, someJson.validators);
                }
              }
            } else {
              this.formControls[someJson.control] = new FormControl();
            }
          } else {
            if (someData[someJson.control]) {
              this.createFormControl(someData[someJson.control], someJson.control, someJson.validators);
            } else {
              if (someJson.type === 'inputButton') {
                this.createFormControl(someJson.value, someJson.control, someJson.validators, true);
              } else {
                this.createFormControl(someJson.value, someJson.control, someJson.validators);
              }
            }
          }
        }
        this.create(someJson[prop], someData);
      }
    }
    if (someJson !== undefined && someJson.isArray) {

      for (const item of someJson) {
        this.create(someJson[item], someData);
      }
    }
  }

  /**
   * Creates a new `FormControl` instance.
   * @param controlName - 'informationNeeded'
   * @param initialValue - ie. text if it's a textarea.
   * @param validators - all the validators for the form control
   * @param updateOn? - validator updateOn options, can be chang/submit/blur
   */
  public createFormControl(initialValue: any, controlName: string, validators: string[], updateOn?: boolean) {
    if (this.validationService.controlHasValidation(validators)) {
      if (updateOn) {
        this.formControls[controlName] = new FormControl(initialValue, {
          validators: this.validationService.getNgValidators(validators),
          updateOn: 'blur'
        });
      } else {
        this.formControls[controlName] = new FormControl(initialValue, this.validationService.getNgValidators(validators));
      }
      return;
    }

    this.formControls[controlName] = new FormControl(initialValue);
  }

  public defineFormControls(someJson: any, someData: any): any {
    this.formControls = [];
    this.create(someJson, someData);
    return this.formControls;
  }
}
