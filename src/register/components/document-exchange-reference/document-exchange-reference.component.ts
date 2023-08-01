import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorMessage } from '../../../shared/models/error-message.model';

@Component({
  selector: 'app-document-exchange-reference',
  templateUrl: './document-exchange-reference.component.html'
})
export class DocumentExchangeReferenceComponent implements OnInit {
  public dxForm: FormGroup;
  public dxError: ErrorMessage;
  constructor(private readonly router: Router) {}

  public ngOnInit(): void {
    this.dxForm = new FormGroup({
      documentExchange: new FormControl(null, Validators.required)
    });
  }

  public onContinue(): void {
    if (this.dxForm.invalid) {
      this.dxError = {
        description: 'Please select at least one option',
        title: '',
        fieldId: 'document-exchange-yes'
      };
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } else {
      if (this.dxForm.get('documentExchange').value === 'yes') {
        this.router.navigate(['register-org', 'document-exchange-reference-details']);
      } else {
        // Navigate to office address page
      }
    }
  }
}
