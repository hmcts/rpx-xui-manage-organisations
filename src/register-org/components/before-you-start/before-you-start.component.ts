import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-before-you-start',
  templateUrl: './before-you-start.component.html'
})
export class BeforeYouStartComponent extends RegisterComponent implements OnInit, OnDestroy {
  public manageCaseLink$: Observable<string>;
  public manageOrgLink$: Observable<string>;

  constructor(
    public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService,
    private readonly environmentService: EnvironmentService
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    this.manageCaseLink$ = this.environmentService.config$.pipe(map((config) => config.manageCaseLink));
    this.manageOrgLink$ = this.environmentService.config$.pipe(map((config) => config.manageOrgLink));

    super.ngOnInit();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
