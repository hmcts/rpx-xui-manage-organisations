import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {StyleGuideFormConstants as CONST} from '../../constants/style-guide-form.constants';
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
  contactPreference;
  sortBySelect;
  moreDetail;
  formConstModel;
  ngOnInit(): void {
    this.formConstModel = CONST.STG_FORM_MODEL;
    // temporary to
    this[CONST.STG_FORM_MODEL.checkboxes] = {
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
            value: 'manageCases',
            label: 'Create cases',
            name: 'checkboxes',
            hint: 'Create, progress and view the status of the user\'s own cases',
            focusOn: 'checkboxes'
          }
        },
        {
          group: this.styleGuideFromGroup.controls.checkboxes,
          config: {
            value: 'manageUsers',
            label: 'View organisation\'s cases',
            name: 'checkboxes',
            hint: ' View the status of all cases created by the organisation\'s users.'
          }
        }
      ]
    };


    this[CONST.STG_FORM_MODEL.contactPreference] = {
      key: CONST.STG_FORM_MODEL.contactPreference,
      config: {
        hint: 'Choose what the user will be able to do. You can change this later.',
        legend: 'How would you prefer to be contacted?',
        key: CONST.STG_FORM_MODEL.contactPreference,
        isHeading: false
      },
      group: this.styleGuideFromGroup,
      items: [
        {
          config: {
            value: 'email',
            label: 'Email',
            id: 'email',
            name: 'contactPreference',
            focusOn: 'contactPreference'
          }
        },
        {
          config: {
            value: 'phone',
            label: 'Phone',
            id: 'phone',
            name: 'contactPreference'
          }
        },
        {
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
      group: this.styleGuideFromGroup,
      config: {
        hint: 'You can sort by different categories',
        id: 'sortBy',
        label: 'Sort By',
        classes: 'govuk-label--m',
        isHeading: true,
      },
      items: [
        {
          value: 'published',
          label: 'Recently Published',
          id: 'published',
        },
        {
          value: 'updated',
          label: 'Recently updated',
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
      key: 'moreDetails',
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
    /**
     * This could be used to dispatch load form data
     * after feature toggle was enabled
     * */
    return true;
  }

}
