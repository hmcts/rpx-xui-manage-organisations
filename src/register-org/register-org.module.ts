import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { registerRouting } from './register-org.routing';
import * as fromServices from './services';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    registerRouting,
    SharedModule
  ],
  providers: [...fromServices.services]
})

export class RegisterOrgModule {}
