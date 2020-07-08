import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { OrganisationService } from 'src/organisation/services';
import { SharedModule } from 'src/shared/shared.module';
import { effects as orgEffects, reducers as orgReducers } from '../organisation/store';
import { UnassignedCasesComponent } from './containers';
import { FeatureToggleAccountGuard } from './guards/feature-toggle.guard';
import { RoleGuard } from './guards/user-role.guard';
import {unassignedCasesRouting} from './unassigned-cases.routing';
// import * as fromServices from './services';
// import * as fromContainers from './containers';
// import { effects, reducers } from './store';

export const COMPONENTS = [ UnassignedCasesComponent ];

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        SharedModule,
        unassignedCasesRouting,
        // StoreModule.forFeature('feeAccounts', reducers),
        // EffectsModule.forFeature(effects),
        StoreModule.forFeature('org', orgReducers),
        EffectsModule.forFeature(orgEffects),
      ],
      // exports: [...fromContainers.containers],
      declarations: [...COMPONENTS],
      providers: [OrganisationService, FeatureToggleAccountGuard, RoleGuard]
    })

export class UnassignedCasesModule {

}
