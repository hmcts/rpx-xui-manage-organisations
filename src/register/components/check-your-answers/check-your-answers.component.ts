import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormDataValuesModel} from '../../models/form-data-values.model';

/**
 * Stateless component responsible for
 * displaying and submitting user's inputted data.
 */

@Component({
  selector: 'app-check-your-answers',
  templateUrl: './check-your-answers.component.html',
})
export class CheckYourAnswersComponent {

  constructor() {}

  formDataValues: FormDataValuesModel;

  @Output() submit = new EventEmitter();
  @Input() set fromValues(values) {
    this.formDataValues = values;
  }

  onSubmitData() {
    this.submit.emit();
  }

}
