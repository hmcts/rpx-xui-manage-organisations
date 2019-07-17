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
import { OrganisationGuard } from './guards/organisation.guard';
import { MonitoringService } from 'src/app/services/monitoring.service';
import { AbstractAppInsights, AppInsightsWrapper } from 'src/app/services/appInsightsWrapper';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    organisationRouting,
    SharedModule,
    StoreModule.forFeature('org', reducers),
    EffectsModule.forFeature(effects),
  ],
  exports: [...fromContainers.containers],
  declarations: [...fromContainers.containers],
  providers: [...fromServices.services, OrganisationGuard,
  { provide: AbstractAppInsights, useClass: AppInsightsWrapper},
  MonitoringService]
})



export class OrganisationModule {

}
