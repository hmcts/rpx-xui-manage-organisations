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
  radios
  ngOnInit(): void {
    // temporary to
    this.checkboxes = {
      key: 'checkboxes',
      config: {
        hint: 'Choose what the user will be able to do. You can change this later.',
        legend: 'Checkboxes',
        key: 'checkboxes',
        isHeading: false
      },
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


    this.radios = {
      key: 'contactPreference',
      config: {
        hint: 'Choose what the user will be able to do. You can change this later.',
        legend: 'How would you prefer to be contacted?',
        key: 'contactPreference',
        isHeading: false
      },
      group: this.styleGuideFromGroup.controls,
      items: [
        {
          group: this.styleGuideFromGroup,
          config: {
            value: 'email',
            label: 'Email',
            id: 'email',
            name: 'contactPreference'
          }
        },
        {
          group: this.styleGuideFromGroup,
          config: {
            value: 'phone',
            label: 'Phone',
            id: 'phone',
            name: 'contactPreference'
          }
        },
        {
          group: this.styleGuideFromGroup,
          config: {
            value: 'textMessage',
            label: 'Text Message',
            id: 'textMessage',
            name: 'contactPreference'
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
