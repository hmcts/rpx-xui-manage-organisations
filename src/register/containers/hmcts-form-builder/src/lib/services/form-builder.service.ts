import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from './form-builder-validation.service';
@Injectable({
  providedIn: 'root'
})

export class FormsService {
  public formControls = [];

  constructor(private readonly validationService: ValidationService) { }

  /**
   * Creation of FormControls for a FormGroup.
   * So first thing is how do we add Validation to a FormControl
   *
   * prop can be a fieldset, legend, text, idPrefix, name, header, checkboxes, if we
   *
   * Here is where the validation is applied to each of the controls of the form, based on the validators that
   * have been plaed into the state_meta.js.
   *
   * also there it's quite hard to work out.
   *
   * @param someJson - The JSON template to be rendered as form control
   * @param someData - The default data value of the form control
   */
  public create(someJson: any, someData: any): void {
    if (this.isObject(someJson)) {
      this.createFromObject(someJson, someData);
    }

    if (Array.isArray(someJson)) {
      this.createFromArray(someJson, someData);
    }
  }

  private createFromObject(someJson: any, someData: any): void {
    Object.keys(someJson).forEach((prop) => {
      if (prop === 'control') {
        this.createControl(someJson, someData);
      }

      this.create(someJson[prop], someData);
    });
  }

  private createFromArray(someJson: any[], someData: any): void {
    someJson.forEach((item) => {
      this.create(item, someData);
    });
  }

  private createControl(someJson: any, someData: any): void {
    if (someJson.radioGroup !== undefined) {
      this.createRadioControl(someJson, someData);
      return;
    }

    this.createStandardControl(someJson, someData);
  }

  private createRadioControl(someJson: any, someData: any): void {
    if (Object.keys(someData).length === 0) {
      this.formControls[someJson.control] = new FormControl();
      return;
    }

    const selectedRadio = someJson.radioGroup.find(
      (radioEl) => radioEl.value === someData[someJson.control]
    );

    if (selectedRadio) {
      this.formControls[someJson.control] = new FormControl(selectedRadio.value);
      return;
    }

    this.createFormControl(null, someJson.control, someJson.validators);
  }

  private createStandardControl(someJson: any, someData: any): void {
    const controlValue = someData[someJson.control];

    if (controlValue) {
      this.createFormControl(controlValue, someJson.control, someJson.validators);
      return;
    }

    const isInputButton = someJson.type === 'inputButton';

    this.createFormControl(
      someJson.value,
      someJson.control,
      someJson.validators,
      isInputButton
    );
  }

  private isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  /**
   * Creates a new `FormControl` instance.
   * @param validators - all the validators for the form control
   * @param updateOn? - validator updateOn options, can be change/submit/blur
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
