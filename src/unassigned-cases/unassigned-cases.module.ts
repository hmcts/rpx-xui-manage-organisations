import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { PaletteModule } from '@hmcts/ccd-case-ui-toolkit';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { OrganisationService } from 'src/organisation/services';
import { SharedModule } from 'src/shared/shared.module';
import { effects as orgEffects, reducers as orgReducers } from '../organisation/store';
import * as fromContainers from './containers';
import { FeatureToggleAccountGuard } from './guards/feature-toggle.guard';
import { RoleGuard } from './guards/user-role.guard';
import * as fromServices from './services';
import { effects, reducers } from './store';
import {unassignedCasesRouting} from './unassigned-cases.routing';

@NgModule({
    imports: [
        CommonModule,
        ExuiCommonLibModule,
        HttpClientModule,
        SharedModule,
        unassignedCasesRouting,
        StoreModule.forFeature('org', orgReducers),
        EffectsModule.forFeature(orgEffects),
        StoreModule.forFeature('unassignedCases', reducers),
        EffectsModule.forFeature(effects),
        PaletteModule,
        MatTabsModule
      ],
      declarations: [...fromContainers.containers],
      providers: [...fromServices.services, OrganisationService, FeatureToggleAccountGuard, RoleGuard],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })

export class UnassignedCasesModule {

}
