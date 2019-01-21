export interface FormGroupValidator {

  /**
   * validatorFunc - Function to validate against
   *
   * @see validation.service.ts
   */
  validatorFunc: string;

  /**
   * validationErrorId - Validation error which is thrown.
   *
   * This can be hooked into through the validationHeaderErrorMessages node within state_meta.js, to display
   * an error message at the appropriate time, within the validation header.
   * @
   */
  validationErrorId: string;

  /**
   * checkboxes - Validation function specific param, the checkboxes required for the isAnyCheckboxChecked
   * validation func.
   */
  controls: Array<string>;
}

export interface controlsisTextAreaValidWhenCheckboxChecked {
  checkboxControl: string,
  textareaControl: string
}
