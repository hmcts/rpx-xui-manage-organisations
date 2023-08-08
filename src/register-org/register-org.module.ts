import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import * as fromComponent from './components';
import * as fromContainers from './containers';
import { registerRouting } from './register-org.routing';
import * as fromServices from './services';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    registerRouting,
    SharedModule
  ],
  exports: [...fromContainers.containers, ...fromComponent.components],
  declarations: [...fromContainers.containers, ...fromComponent.components],
  providers: [...fromServices.services]
})

export class RegisterOrgModule {}
