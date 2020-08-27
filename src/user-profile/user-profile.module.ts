import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {AcceptTcService} from '../accept-tc/services/accept-tc.service';
import {ProfileComponent} from './containers/profile/profile.component';
import {AuthGuard} from './guards/auth.guard';
import {UserGuard} from './guards/user.guard';
import {AuthService} from './services/auth.service';
import {UserService} from './services/user.service';
import {effects, reducer} from './store';
import {userProfileRouting} from './userProfile.routing';

const PROVIDERS = [AuthGuard, UserGuard];
const COMPONENTS = [ProfileComponent];
const SERVICES = [AuthService, UserService, AcceptTcService];

@NgModule({
  imports: [
    CommonModule,
    userProfileRouting,
    StoreModule.forFeature('userProfile', reducer),
    EffectsModule.forFeature(effects),
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [...PROVIDERS, ...SERVICES]
})

export class UserProfileModule {

}
