import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material';
import { CaseListModule } from '@hmcts/ccd-case-ui-toolkit';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { OrganisationService } from '../organisation/services';
import { SharedModule } from '../shared/shared.module';
import { effects as orgEffects, reducers as orgReducers } from '../organisation/store';
import { caaCasesRouting } from './caa-cases.routing';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import { FeatureToggleAccountGuard } from './guards/feature-toggle.guard';
import { RoleGuard } from './guards/user-role.guard';
import * as fromServices from './services';
import { effects, reducers } from './store';

@NgModule({
    imports: [
        CommonModule,
        ExuiCommonLibModule,
        HttpClientModule,
        SharedModule,
        caaCasesRouting,
        StoreModule.forFeature('org', orgReducers),
        EffectsModule.forFeature(orgEffects),
        StoreModule.forFeature('caaCases', reducers),
        EffectsModule.forFeature(effects),
        CaseListModule,
        MatTabsModule
      ],
      exports: [...fromContainers.containers, ...fromComponents.components],
      declarations: [...fromContainers.containers, ...fromComponents.components],
      providers: [...fromServices.services, OrganisationService, FeatureToggleAccountGuard, RoleGuard],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })

export class CaaCasesModule {
}
