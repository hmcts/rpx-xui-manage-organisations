import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { organisationRouting } from './organisation.routing';
import { SharedModule } from '../shared/shared.module';

// containers
import * as fromContainers from './containers';

// services
import * as fromServices from './services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    organisationRouting,
    SharedModule,
    StoreModule.forFeature('organisation', reducers),
    EffectsModule.forFeature(effects),
  ],
  exports: [...fromContainers.containers],
  declarations: [...fromContainers.containers],
  providers: [...fromServices.services]
})



export class OrganisationModule {

}
