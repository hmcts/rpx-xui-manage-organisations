import {UntypedFormGroup} from '@angular/forms';

export interface CheckboxesModel {
  key: string;
  group: UntypedFormGroup;
  config: {hint: string; legend: string};
  errors: any;
  items: object[];
}
