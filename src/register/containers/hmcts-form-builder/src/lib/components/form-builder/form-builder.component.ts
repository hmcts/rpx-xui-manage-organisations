import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormsService} from '../../services/form-builder.service';
import {ValidationService} from '../../services/form-builder-validation.service';

/**
 * Form Builder Wrapper
 * Component accepts pageItems and pageValues for From Builder to process
 * and it emits form data to it's parent component.
 */

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html'
})

export class FormBuilderComponent implements OnChanges {

  constructor(
    private formsService: FormsService,
    private validationService: ValidationService) {}

  @Input() pageItems: any;
  @Input() pageValues: any;
  @Input() isPageValid: boolean;
  @Output() submitPage = new EventEmitter<FormGroup>();

  formDraft: FormGroup;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pageItems && changes.pageItems.currentValue) {
      this.createForm();
    }
  }

  // So when the form is created it should get into here and create the form
  // then set the validators.
  createForm() {
    console.log('this.pageItems');
    console.log(this.pageItems);
    console.log('this.pageValues');
    console.log(this.pageValues);
    this.formDraft = new FormGroup(this.formsService.defineformControls(this.pageItems, this.pageValues));
    this.setValidators();
  }

  // we need to loop through validators
  setValidators(): void {
    if (this.pageItems) {
      const formGroupValidators = this.validationService.createFormGroupValidators(this.formDraft, this.pageItems.formGroupValidators);
      this.formDraft.setValidators(formGroupValidators);
    }
  }

  onFormSubmit() {
    this.submitPage.emit(this.formDraft);
  }
}
