import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  @ViewChild('mainContent') public mainContentElement: ElementRef;

  public manageCaseLink$: Observable<string>;
  public manageOrgLink$: Observable<string>;
  public beforeYouStartForm: FormGroup;
  public beforeYouStartErrors: { id: string, message: string }[] = [];
  public errorPresent = false;

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

    this.beforeYouStartForm = new FormGroup({
      confirmedOrganisationAccount: new FormControl(null, Validators.required)
    });
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public onStart(): void {
    if (this.isFormValid()) {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'organisation-type']);
    }
  }

  private isFormValid(): boolean {
    if (this.beforeYouStartForm.invalid ||
      !this.beforeYouStartForm.get('confirmedOrganisationAccount').value) {
      this.beforeYouStartErrors = [{
        message: 'Please select the checkbox',
        id: 'confirmed-organisation-account'
      }];
      this.errorPresent = true;
      this.mainContentElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
      return false;
    }
    return true;
  }
}
