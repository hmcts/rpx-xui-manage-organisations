import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './containers/profile/profile.component';
import { authRouting } from './auth.routing';
import { OrganisationGuard } from './guards/organisation.guard';

const PROVIDERS = [AuthService, AuthGuard, OrganisationGuard];
const COMPONENTS = [ProfileComponent];
@NgModule({
  imports: [
    CommonModule,
    authRouting
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [...PROVIDERS]
})

export class AuthModule {

}
