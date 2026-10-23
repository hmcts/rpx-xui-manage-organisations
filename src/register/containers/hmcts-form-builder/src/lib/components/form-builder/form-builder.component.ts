import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ValidationService } from '../../services/form-builder-validation.service';
import { FormsService } from '../../services/form-builder.service';
import { buildIdOrIndexKey } from 'src/shared/utils/track-by.util';

/**
 * Form Builder Wrapper
 * Component accepts pageItems and pageValues for From Builder to process
 * and it emits form data to it's parent component.
 */

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  standalone: false
})

export class FormBuilderComponent implements OnChanges {
  constructor(
    private readonly formsService: FormsService,
    private readonly validationService: ValidationService
  ) { }

  @Input() public pageItems: any;
  @Input() public pageValues: any;
  @Input() public isPageValid: boolean;
  @Output() public submitPage = new EventEmitter<FormGroup>();
  @Output() public btnClick = new EventEmitter<any>();
  @Output() public blurCast = new EventEmitter<any>();

  public formDraft: FormGroup;

  public get pageHeadingFieldset(): any[] | undefined {
    if (this.pageItems?.header) {
      return undefined;
    }
    return this.pageItems?.groups?.find((group: any) =>
      group.fieldset?.some((item: any) => item.legend)
    )?.fieldset;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.pageItems?.currentValue) {
      this.createForm();
    }
  }

  public createForm(): void {
    this.formDraft = new FormGroup(this.formsService.defineFormControls(this.pageItems, this.pageValues));
    this.setValidators();
  }

  public setValidators(): void {
    if (this.pageItems) {
      const formGroupValidators = this.validationService.createFormGroupValidators(this.formDraft, this.pageItems.formGroupValidators);
      this.formDraft.setValidators(formGroupValidators);
    }
  }

  public onFormSubmit(): void {
    this.submitPage.emit(this.formDraft);
  }

  public onBtnClick(eventId) {
    this.btnClick.emit({ eventId, data: this.formDraft });
  }

  public onBlur(eventId) {
    this.blurCast.emit(eventId);
  }

  // trackBy helper for groups to avoid identity churn / duplicate empty keys
  public trackByFormGroup(index: number, group: any): string | number {
    return buildIdOrIndexKey(index, group, 'id', 'name', 'fieldId');
  }
}
