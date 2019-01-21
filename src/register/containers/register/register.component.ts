import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormsService} from '../../../app/containers/form-builder/services/form-builder.service';
import {ValidationService} from '../../../app/containers/form-builder/services/form-builder-validation.service';

/**
 * Bootstraps the Register Components
 */

@Component({
  selector: 'app-prd-register-component',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

  constructor(private formsService: FormsService, private validationService: ValidationService ) {}
  formDraft: FormGroup;

  ngOnInit(): void {;
  }

  createForm(pageitems, pageValues) {
    this.formDraft = new FormGroup(this.formsService.defineformControls(pageitems, pageValues));
    const formGroupValidators = this.validationService.createFormGroupValidators(this.formDraft, pageitems.formGroupValidators);
    this.formDraft.setValidators(formGroupValidators);
  }

  // dispatch load action

  // subscribe to a selector
}

