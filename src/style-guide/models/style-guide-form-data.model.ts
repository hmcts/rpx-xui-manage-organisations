import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

export interface StyleGuideFormDataModel {
  input: UntypedFormControl | string[];
  checkboxes: UntypedFormGroup | string[];
  passport: UntypedFormGroup | string[];
  contactPreference: UntypedFormGroup | string[];
  sortBy: UntypedFormGroup | string[];
  moreDetails: UntypedFormGroup | string[];
  fileUpload: UntypedFormGroup | string[]
}
