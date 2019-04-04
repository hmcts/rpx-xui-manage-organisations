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
  radios;
  sortBySelect;
  moreDetail;
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
    };


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
            name: 'contactPreference',
            focusOn: 'contactPreference'
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
    };

    this.sortBySelect = {
      config: {
        hint: 'You can sort by different categories',
        key: 'sortBy',
        label: 'Sort By',
        classes: 'govuk-label--m',
        isHeading: true,
      },
      group: this.styleGuideFromGroup,
      items: [
        {
          value: 'published',
          label: 'Recently Published',
          id: 'published',
        },
        {
          value: 'updated',
          label: 'Recently updated',
          isSelected: true,
          id: 'phone',
        },
        {
          value: 'views',
          label: 'Most views',
          id: 'views',
        },
        {
          value: 'comments',
          label: 'Most comments',
          id: 'comments',
        }
      ]
    };

    this.moreDetail = {
      id: 'moreDetails',
      label: 'Can you provide more detail?',
      hint: 'Do not include personal or financial information, like your National Insurance number or credit card details.',
      rows: 5,
      classes: 'govuk-label--m',
      isPageHeading: true
    }
  }

  onSubmit() {
    this.submitForm.emit();
  }

  dispatchLoadData() {
    return true
  }

}
