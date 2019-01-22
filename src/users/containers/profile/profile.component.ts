import { Component, OnInit } from '@angular/core';
//import { FormGroup } from '@angular/forms';
//import { FormsService } from '../../../app/containers/form-builder/services/form-builder.service';
//import { ValidationService } from '../../../app/containers/form-builder/services/form-builder-validation.service';
//import { select, Store } from '@ngrx/store';
//import * as fromStore from '../../store';
import { Observable } from 'rxjs';
import { debug } from 'util';



/**
 * Bootstraps the Register Components
 */

@Component({
  selector: 'app-prd-profile-component',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

  constructor(
    // private formsService: FormsService,
    // private validationService: ValidationService,
    // private store: Store<fromStore.RegistrationState>
  ) { }

  //formDraft: FormGroup;
  //formDraftSelector$: Observable<any>

  ngOnInit(): void {
    // this.store.dispatch(new fromStore.LoadRegistrationForm());
    // this.store.pipe(select(fromStore.getRegistationEntities)).subscribe(formData => {
    //   console.log(formData);
    //})
  }



  // dispatch load action

  // subscribe to a selector
}

