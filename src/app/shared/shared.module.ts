import { NgModule } from '@angular/core';

import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {FromBuilderComponent} from '../containers';
import {FormsService} from '../containers/form-builder/services/form-builder.service';
import {ValidationService} from '../containers/form-builder/services/form-builder-validation.service';


@NgModule( {
  imports: [
    FormsModule, CommonModule,
  ],
  declarations: [
    FromBuilderComponent
  ],
  exports: [
    FromBuilderComponent
  ],
  providers: [
    FormsService,
    ValidationService,

  ]
} )
export class SharedModule {
}
