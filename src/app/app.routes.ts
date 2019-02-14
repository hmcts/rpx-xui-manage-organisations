import { AuthService } from '../auth/auth.service';
import { OrganisationModule } from '../organisation/organisation.module';
import { Routes } from '@angular/router';


export const ROUTES: Routes = [
  {
    path: '',
    component: OrganisationModule,
    canActivate: [AuthService],
  },
];

