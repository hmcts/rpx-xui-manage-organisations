import { NgModule } from '@angular/core';
import {HmctsSubNavigationComponent} from './components/hmcts-sub-navigation/hmcts-sub-navigation.component';
import {HmctsIdentityBarComponent} from './components/hmcts-identity-bar/hmcts-identity-bar.component';
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
import {GovUkFieldsetComponent} from './components/gov-uk-fieldset/gov-uk-fieldset.component';
import {GovUkDateComponent} from './components/gov-uk-date/gov-uk-date.component';
import {CheckboxesComponent} from './components/gov-uk-checkboxes/checkboxes.component';
import {GovUkRadioComponent} from './components/gov-uk-radio/gov-uk-radio.component';
import {GovUkRadiosComponent} from './components/gov-uk-radios/gov-uk-radios.component';
import {GovUkSelectComponent} from './components/gov-uk-select/gov-uk-select.component';
import {GovUkTextareaComponent} from './components/gov-uk-textarea/gov-uk-textarea.component';
import {GovUkFileUploadComponent} from './components/gov-uk-file-upload/gov-uk-file-upload.component';

const COMPONENTS = [
  GovukTableComponent,
  HmctsIdentityBarComponent,
  HmctsSubNavigationComponent,
  GovUkInputComponent,
  GovUkCheckboxComponent,
  GovUkFormGroupWrapperComponent,
  GovUkLabelComponent,
  GovUkErrorMessageComponent,
  RemoveHostDirective,
  GovUkFieldsetComponent,
  GovUkDateComponent,
  CheckboxesComponent,
  GovUkRadioComponent,
  GovUkRadiosComponent,
  GovUkSelectComponent,
  GovUkTextareaComponent,
  GovUkFileUploadComponent
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
