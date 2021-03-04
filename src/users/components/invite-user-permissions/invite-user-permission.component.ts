import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-invite-permission-form',
  templateUrl: './invite-user-permission.component.html',
})

export class InviteUserPermissionComponent  implements OnInit {
  @Input() public inviteUserForm: FormGroup;
  @Input() public isPuiCaseManager: boolean = false;
  @Input() public isPuiUserManager: boolean = false;
  @Input() public isPuiOrganisationManager: boolean = false;
  @Input() public isPuiFinanceManager: boolean = false;
  @Input() public isCaseAccessAdmin: boolean = false;
  @Input() public errorMessages: { isInvalid: boolean; messages: string[] };

  public grantCaseAccessAdmin$: Observable<boolean>;

  constructor(public readonly featureToggleService: FeatureToggleService) {
  }

  public ngOnInit() {
    this.grantCaseAccessAdmin$ = this.featureToggleService.getValue('mo-grant-case-access-admin', false);
  }

}
