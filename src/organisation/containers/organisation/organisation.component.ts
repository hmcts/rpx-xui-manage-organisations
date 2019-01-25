import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormsService } from '../../../app/containers/form-builder/services/form-builder.service';
import { ValidationService } from '../../../app/containers/form-builder/services/form-builder-validation.service';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store';
import { Observable } from 'rxjs';
import { debug } from 'util';
import { Organisation } from 'src/organisation/organisation.model';




@Component({
  selector: 'app-prd-organisation-component',
  templateUrl: './organisation.component.html',
})
export class OrganisationComponent implements OnInit {

  orgData: Organisation

  constructor(
    private store: Store<fromStore.OrganisationState>
  ) { }



  ngOnInit(): void {
    this.store.dispatch(new fromStore.LoadOrganisation());
    this.store.pipe(select(fromStore.getOrganisationSel)).subscribe(data => {
      this.orgData = data
    })
  }




}

