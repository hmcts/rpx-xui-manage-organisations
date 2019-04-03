import {FormGroup} from '@angular/forms';

export interface CheckboxesModel {
  key: string;
  group: FormGroup;
  config: {hint: string; legend: string};
  errors: any;
  items: object[];
}
