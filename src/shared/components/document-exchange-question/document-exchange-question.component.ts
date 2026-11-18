import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-document-exchange-question',
  templateUrl: './document-exchange-question.component.html',
  standalone: false
})
export class DocumentExchangeQuestionComponent implements OnChanges {
  @Input() public caption: string = '';
  @Input() public hasDxReference: boolean = false;
  @Input() public useMainWrapperBackLink = false;

  @Output() public readonly submitted = new EventEmitter<boolean>();
  @Output() public readonly backRequested = new EventEmitter<void>();
  @Output() public readonly cancelled = new EventEmitter<void>();

  @ViewChild('mainContent') public mainContentElement: ElementRef | undefined;

  public formGroup = new FormGroup({
    documentExchange: new FormControl<'yes' | 'no' | null>(
      null,
      Validators.required
    )
  });

  public errors: { id: string, message: string }[] = [];
  public errorPresent = false;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasDxReference && this.hasDxReference !== null && this.hasDxReference !== undefined) {
      this.formGroup.get('documentExchange')?.setValue(this.hasDxReference ? 'yes' : 'no');
    }
  }

  public onContinue(): void {
    if (this.formGroup.invalid) {
      this.errors = [{ id: 'document-exchange-yes', message: 'Please select an option' }];
      this.errorPresent = true;
      this.mainContentElement?.nativeElement.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    this.errors = [];
    this.errorPresent = false;
    this.submitted.emit(this.formGroup.get('documentExchange')?.value === 'yes');
  }
}
