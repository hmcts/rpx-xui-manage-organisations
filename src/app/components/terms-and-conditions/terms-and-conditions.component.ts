import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeatureToggleService, TCDocument } from '@hmcts/rpx-xui-common-lib';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { TermsConditionsService } from '../../../shared/services/termsConditions.service';
import { AppConstants } from '../../app.constants';
import * as fromRoot from '../../store';

@Component({
    selector: 'app-terms-and-conditions',
    templateUrl: './terms-and-conditions.component.html',
    standalone: false
})
export class TermsAndConditionsComponent implements OnInit, OnDestroy {
  private readonly ROUTE_TERMS_AND_CONDITIONS_REGISTER_OTHER_ORG = 'terms-and-conditions-register-other-org';
  public document: TCDocument = null;

  private readonly subscriptions: Subscription[] = [];

  public isTandCEnabled: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly store: Store<fromRoot.State>,
    private readonly termsAndConditionsService: TermsConditionsService,
    private readonly featureToggleService: FeatureToggleService
  ) {}

  public ngOnInit(): void {
    // Navigate to new terms and conditions page if new register organisation feature is turned on
    this.subscriptions[0] = this.featureToggleService.getValue(AppConstants.FEATURE_NAMES.newRegisterOrg, false).subscribe((newRegisteOrgFeature) => {
      if (newRegisteOrgFeature) {
        this.router.navigate([this.ROUTE_TERMS_AND_CONDITIONS_REGISTER_OTHER_ORG]);
      } else {
        this.termsAndConditionsService.isTermsConditionsFeatureEnabled().subscribe((enabled) => {
          if (enabled) {
            this.isTandCEnabled = true;
            const s = this.store.pipe(
              select(fromRoot.getTermsAndConditions)
            ).subscribe((doc) => {
              if (doc) {
                this.document = doc;
              } else {
                this.store.dispatch(new fromRoot.LoadTermsConditions());
              }
            });
            this.subscriptions.push(s);
          }
        });
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
