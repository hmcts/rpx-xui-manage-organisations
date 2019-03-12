import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './guards/auth.guard';
import {ProfileComponent} from './containers/profile/profile.component';
import {authRouting} from './auth.routing';
import {UserGuard} from './guards/user.guard';
import {UserService} from './services/user.service';
import {effects, reducer} from './store';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import { OrganisationGuard } from './guards/organisation.guard';

const PROVIDERS = [AuthGuard, OrganisationGuard, UserGuard];
const COMPONENTS = [ProfileComponent];
const SERVICES = [ AuthService, UserService];

@NgModule({
  imports: [
    CommonModule,
    authRouting,
    StoreModule.forFeature('auth', reducer),
    EffectsModule.forFeature(effects),
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [...PROVIDERS, ...SERVICES]
})

export class AuthModule {

}
