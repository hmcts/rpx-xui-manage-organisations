import { NgModule } from '@angular/core';

import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {FromBuilderComponent} from '../containers';
import {FormsService} from '../containers/form-builder/services/form-builder.service';
import {ValidationService} from '../containers/form-builder/services/form-builder-validation.service';
import { HmctsSubNavigationComponent } from '../components/hmcts-sub-navigation/hmcts-sub-navigation.component';
import { RouterModule } from '@angular/router';
import { HmctsIdentityBarComponent } from '../components/hmcts-identity-bar/hmcts-identity-bar.component';
import { GovukTableComponent } from '../components/govuk-table/govuk-table.component';


@NgModule( {
  imports: [
    FormsModule, CommonModule, RouterModule,
  ],
  declarations: [
    FromBuilderComponent,
    HmctsSubNavigationComponent,
    HmctsIdentityBarComponent,
    GovukTableComponent
  ],
  exports: [
    FromBuilderComponent,
    HmctsSubNavigationComponent,
    HmctsIdentityBarComponent,
    GovukTableComponent
  ],
  providers: [
    FormsService,
    ValidationService,

  ]
} )
export class SharedModule {
}
