import { NgModule } from '@angular/core';
import {HmctsSubNavigationComponent} from './components/hmcts-sub-navigation/hmcts-sub-navigation.component';
import {HmctsIdentityBarComponent} from './components/hmcts-identity-bar/hmcts-identity-bar.component';
import {GovUkMainWrapperComponent} from './components/gov-uk-mian-wrapper/gov-uk-main-wrapper.component';
import {GovUkErrorSummaryComponent} from './components/gov-uk-error-summary/gov-uk-error-summary.component';
import {GovukTableComponent} from './components/govuk-table/govuk-table.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GovUkCheckboxComponent} from './components/gov-uk-checkbox/gov-uk-checkbox.component';
import {GovUkInputComponent} from './components/gov-uk-input/gov-uk-input.component';
import {GovUkFormGroupWrapperComponent} from './components/gov-uk-form-group-wrapper/gov-uk-form-group-wrapper.component';
import {GovUkLabelComponent} from './components/gov-uk-label/gov-uk-label.component';
import {GovUkErrorMessageComponent} from './components/gov-uk-error-message/gov-uk-error-message.component';
import {RemoveHostDirective} from '../../../../src/app/directives/remove-host.directive';

const COMPONENTS = [
  GovukTableComponent,
  HmctsIdentityBarComponent,
  HmctsSubNavigationComponent,
  GovUkMainWrapperComponent,
  GovUkErrorSummaryComponent,
  GovUkInputComponent,
  GovUkCheckboxComponent,
  GovUkFormGroupWrapperComponent,
  GovUkLabelComponent,
  GovUkErrorMessageComponent,
  RemoveHostDirective
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
