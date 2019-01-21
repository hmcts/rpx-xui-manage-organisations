import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormsService} from '../../../app/containers/form-builder/services/form-builder.service';
import {ValidationService} from '../../../app/containers/form-builder/services/form-builder-validation.service';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';
import {Observable} from 'rxjs';
import {debug} from 'util';



/**
 * Bootstraps the Login Components
 */

@Component({
  selector: 'app-prd-login-component',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  constructor(
    private formsService: FormsService,
    private validationService: ValidationService,
    private store: Store<fromStore.LoginState>) {}

  formDraft: FormGroup;
  formDraftSelector$: Observable<any>;

  ngOnInit(): void {
    this.store.dispatch(new fromStore.LoadLoginForm());
    this.store.pipe(select(fromStore.getLoginEntities)).subscribe(formData => {
      console.log(formData);
    });
  }

  createForm(pageitems, pageValues) {
    this.formDraft = new FormGroup(this.formsService.defineformControls(pageitems, pageValues));
    const formGroupValidators = this.validationService.createFormGroupValidators(this.formDraft, pageitems.formGroupValidators);
    this.formDraft.setValidators(formGroupValidators);
  }

  // dispatch load action

  // subscribe to a selector
}

