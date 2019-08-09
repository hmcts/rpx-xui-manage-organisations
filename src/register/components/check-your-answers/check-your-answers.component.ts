import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {FormDataValuesModel} from '../../models/form-data-values.model';

/**
 * Stateless component responsible for
 * displaying and submitting user's inputted data.
 */

@Component({
  selector: 'app-check-your-answers',
  templateUrl: './check-your-answers.component.html',
})
export class CheckYourAnswersComponent implements AfterViewInit {

  constructor() {}

  formDataValues: FormDataValuesModel;

  @Output() submit = new EventEmitter();
  @Input() set fromValues(values) {
    this.formDataValues = values;
  }

  // Set to focus to the title when the page started for accessibility
  ngAfterViewInit() {
    const focusElement = document.getElementsByTagName('h1')[0];
    if (focusElement) {
      focusElement.setAttribute('tabindex', '-1');
      focusElement.focus();
    }
  }

  onSubmitData() {
    this.submit.emit();
  }

}
