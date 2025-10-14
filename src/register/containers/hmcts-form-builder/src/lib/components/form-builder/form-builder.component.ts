import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ValidationService } from '../../services/form-builder-validation.service';
import { FormsService } from '../../services/form-builder.service';

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
  ) {}

  @Input() public pageItems: any;
  @Input() public pageValues: any;
  @Input() public isPageValid: boolean;
  @Output() public submitPage = new EventEmitter<FormGroup>();
  @Output() public btnClick = new EventEmitter<any>();
  @Output() public blurCast = new EventEmitter<any>();

  public formDraft: FormGroup;
  public isLegendAvailable: boolean;

  public ngOnChanges(changes: SimpleChanges): void {
    this.isLegendAvailable = false;
    if (changes.pageItems && changes.pageItems.currentValue) {
      this.createForm();
    }
    if (this.pageItems && this.pageItems.groups) {
      for (const group of this.pageItems.groups) {
        if (group.fieldset) {
          for (const item of group.fieldset) {
            if (item.legend) {
              this.isLegendAvailable = true;
              break;
            }
          }
        }
      }
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
}
