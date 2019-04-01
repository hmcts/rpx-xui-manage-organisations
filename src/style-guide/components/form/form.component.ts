import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {

  @Output() submitForm = new EventEmitter();
  @Input() styleGuideFromGroup: FormGroup;
  @Input() set errorMessages(value) {
    this.errors = value || {};
  }

  errors: string[];
  checkboxes;

  ngOnInit(): void {
    // temporary to
    this.checkboxes = {
      key: 'checkboxes',
      config: {hint: 'Choose what the user will be able to do. You can change this later.', legend: 'Checkboxes'},
      group: this.styleGuideFromGroup.controls,
      items: [
        {
          group: this.styleGuideFromGroup.controls.checkboxes,
          config: {
            value: 'createCases',
            label: 'Create cases',
            name: 'checkboxes',
            hint: 'Create, progress and view the status of the user\'s own cases',
            focusOn: 'checkboxes'
          }
        },
        {
          group: this.styleGuideFromGroup.controls.checkboxes,
          config: {
            value: 'viewCases',
            label: 'View organisation\'s cases',
            name: 'checkboxes',
            hint: ' View the status of all cases created by the organisation\'s users.'
          }
        }
      ]
    }
  }

  onSubmit() {
    this.submitForm.emit();
  }

  dispatchData() {
    return true
  }

}
