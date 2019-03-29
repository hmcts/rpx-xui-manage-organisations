import {FormControl, FormGroup} from '@angular/forms';

export interface StyleGuideFormDataModel {
  input: FormControl | string[];
  checkboxes: FormGroup | string[];
  passport: FormGroup | string[];

}
