import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Observable, Subject } from 'rxjs';
import { User } from '@hmcts/rpx-xui-common-lib';

@Component({
  selector: 'app-static-user-permissions',
  templateUrl: './static-user-permissions.component.html'
})
export class StaticUserPermissionsComponent implements OnInit, OnDestroy {
  @Input() public user: User;

  @Output() public selectedPermissionsChanged = new EventEmitter<UserPermissionViewModel>();

  public permissionsForm: FormGroup<AccessForm>;
  public permissions: UserPermissionViewModel;

  public grantCaseAccessAdmin$: Observable<boolean>;
  public grantFinanceManager$: Observable<boolean>;

  private onDestory$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    public readonly featureToggleService: FeatureToggleService
  ) {}

  ngOnInit(): void {
    this.grantCaseAccessAdmin$ = this.featureToggleService.getValue(
      'mo-grant-case-access-admin',
      false
    );
    this.grantFinanceManager$ = this.featureToggleService.getValue(
      'mo-grant-manage-fee-accounts',
      false
    );
    this.permissions = this.createPermissionsViewModelFromInput();
    this.selectedPermissionsChanged.emit(this.permissions);
    this.createFormAndPopulate();
    this.subscribeToAccessTypesChanges();
  }

  ngOnDestroy(): void {
    this.onDestory$.next();
    this.onDestory$.complete();
  }

  createFormAndPopulate() {
    this.permissionsForm = this.fb.nonNullable.group<AccessForm>({
      isPuiCaseManager: new FormControl<boolean>(this.permissions.isPuiCaseManager),
      isPuiUserManager: new FormControl<boolean>(this.permissions.isPuiUserManager),
      isPuiOrganisationManager: new FormControl<boolean>(this.permissions.isPuiOrganisationManager),
      isPuiFinanceManager: new FormControl<boolean>(this.permissions.isPuiFinanceManager),
      isCaseAccessAdmin: new FormControl<boolean>(this.permissions.isCaseAccessAdmin)
    });
  }

  private subscribeToAccessTypesChanges() {
    this.permissionsForm.valueChanges.subscribe((permissions) => {
      this.permissions.isPuiCaseManager = permissions.isPuiCaseManager;
      this.permissions.isPuiUserManager = permissions.isPuiUserManager;
      this.permissions.isPuiOrganisationManager = permissions.isPuiOrganisationManager;
      this.permissions.isPuiFinanceManager = permissions.isPuiFinanceManager;
      this.permissions.isCaseAccessAdmin = permissions.isCaseAccessAdmin;
      this.selectedPermissionsChanged.emit(this.createPermissionsViewModelFromForm());
    });
  }

  private createPermissionsViewModelFromInput(): UserPermissionViewModel {
    return {
      isPuiCaseManager: this.user?.manageCases === 'Yes',
      isPuiUserManager: this.user?.manageUsers === 'Yes',
      isPuiOrganisationManager: this.user?.manageOrganisations === 'Yes',
      isPuiFinanceManager: this.user?.managePayments === 'Yes',
      isCaseAccessAdmin: this.user?.roles?.includes('pui-caa')
    };
  }

  private createPermissionsViewModelFromForm(): UserPermissionViewModel {
    return {
      isPuiCaseManager: this.permissions.isPuiCaseManager,
      isPuiUserManager: this.permissions.isPuiUserManager,
      isPuiOrganisationManager: this.permissions.isPuiOrganisationManager,
      isPuiFinanceManager: this.permissions.isPuiFinanceManager,
      isCaseAccessAdmin: this.permissions.isCaseAccessAdmin
    };
  }
}

export interface UserPermissionViewModel {
  isPuiCaseManager: boolean;
  isPuiUserManager: boolean;
  isPuiOrganisationManager: boolean;
  isPuiFinanceManager: boolean;
  isCaseAccessAdmin: boolean;
}

interface AccessForm {
  isPuiCaseManager: FormControl<boolean>;
  isPuiUserManager: FormControl<boolean>;
  isPuiOrganisationManager: FormControl<boolean>;
  isPuiFinanceManager: FormControl<boolean>;
  isCaseAccessAdmin: FormControl<boolean>;
}
