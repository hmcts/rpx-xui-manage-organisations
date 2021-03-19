import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ValidationService} from '../../services/form-builder-validation.service';
import {FormsService} from '../../services/form-builder.service';

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

  @Input() public pageItems: any;
  @Input() public pageValues: any;
  @Input() public isPageValid: boolean;
  @Output() public submitPage = new EventEmitter<FormGroup>();
  @Output() public btnClick = new EventEmitter<FormGroup>();

  public formDraft: FormGroup;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.pageItems && changes.pageItems.currentValue) {
      this.createForm();
    }
  }

  public createForm() {
    this.formDraft = new FormGroup(this.formsService.defineformControls(this.pageItems, this.pageValues));
    this.setValidators();
  }

  public setValidators(): void {
    if (this.pageItems) {
      const formGroupValidators = this.validationService.createFormGroupValidators(this.formDraft, this.pageItems.formGroupValidators);
      this.formDraft.setValidators(formGroupValidators);
    }
  }

  public onFormSubmit() {
    this.submitPage.emit(this.formDraft);
  }

  public onBtnClick(event) {
    this.btnClick.emit(event);
  }
}
