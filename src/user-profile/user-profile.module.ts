import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthGuard} from './guards/auth.guard';
import {ProfileComponent} from './containers/profile/profile.component';
import {userProfileRouting} from './userProfile.routing';
import {UserGuard} from './guards/user.guard';
import {UserService} from './services/user.service';
import {effects, reducer} from './store';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

const PROVIDERS = [AuthGuard, UserGuard];
const COMPONENTS = [ProfileComponent];
const SERVICES = [UserService];

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
