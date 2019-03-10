import { NgModule } from '@angular/core';
import {HmctsSubNavigationComponent} from './components/hmcts-sub-navigation/hmcts-sub-navigation.component';
import {HmctsIdentityBarComponent} from './components/hmcts-identity-bar/hmcts-identity-bar.component';
import {GovUkMainWrapperComponent} from './components/gov-uk-mian-wrapper/gov-uk-main-wrapper.component';
import {GovUkErrorSummaryComponent} from './components/gov-uk-error-summary/gov-uk-error-summary.component';
import {GovukTableComponent} from './components/govuk-table/govuk-table.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GovUkTextInputComponent} from './components/gov-uk-input/gov-uk-text-input.component';

const COMPONENTS = [
  GovukTableComponent,
  HmctsIdentityBarComponent,
  HmctsSubNavigationComponent,
  GovUkMainWrapperComponent,
  GovUkErrorSummaryComponent,
  GovUkTextInputComponent
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS]
})

export class GovUiModule { }
