import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { CaseListModule } from '@hmcts/ccd-case-ui-toolkit';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { OrganisationService, PBAService } from '../organisation/services';
import { effects as orgEffects, reducers as orgReducers } from '../organisation/store';
import { SharedModule } from '../shared/shared.module';
import { InviteUserService, UsersService } from '../users/services';
import { effects as userEffects, reducers as userReducers } from '../users/store';
import { caaCasesRouting } from './caa-cases.routing';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import { FeatureToggleAccountGuard } from './guards/feature-toggle.guard';
import { RoleGuard } from './guards/user-role.guard';
import * as fromServices from './services';
import { effects, reducers } from './store';
import { NewCaseFeatureToggleGuard } from './guards/new-cases-feature-toggle.guard';

@NgModule({
  exports: [...fromContainers.containers, ...fromComponents.components],
  declarations: [...fromContainers.containers, ...fromComponents.components],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule,
    ExuiCommonLibModule,
    SharedModule,
    caaCasesRouting,
    StoreModule.forFeature('org', orgReducers),
    EffectsModule.forFeature(orgEffects),
    StoreModule.forFeature('users', userReducers),
    EffectsModule.forFeature(userEffects),
    StoreModule.forFeature('caaCases', reducers),
    EffectsModule.forFeature(effects),
    CaseListModule,
    MatTabsModule,
    MatAutocompleteModule
  ],
  providers: [...fromServices.services, OrganisationService, PBAService, UsersService, InviteUserService, FeatureToggleAccountGuard, NewCaseFeatureToggleGuard, RoleGuard, provideHttpClient(withInterceptorsFromDi())]
})

export class CaaCasesModule {
}
