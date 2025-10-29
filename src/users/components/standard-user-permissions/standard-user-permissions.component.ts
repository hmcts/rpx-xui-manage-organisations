import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Observable, Subject } from 'rxjs';
import { User } from '@hmcts/rpx-xui-common-lib';
import { BasicAccessTypes } from '../../models/basic-access-types.model';

@Component({
  selector: 'app-standard-user-permissions',
  templateUrl: './standard-user-permissions.component.html',
  standalone: false,
})
export class StandardUserPermissionsComponent implements OnInit, OnDestroy {
  @Input() public user: User;

  @Output() public selectedPermissionsChanged = new EventEmitter<BasicAccessTypes>();

  public permissionsForm: FormGroup<AccessForm>;
  public permissions: BasicAccessTypes;
  public errors: {basicPermissions: string[]} = {
    basicPermissions: []
  };

  public grantCaseAccessAdmin$: Observable<boolean>;
  public grantFinanceManager$: Observable<boolean>;

  private onDestroy$ = new Subject<void>();

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
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  createFormAndPopulate() {
    this.permissionsForm = this.fb.nonNullable.group<AccessForm>({
      isPuiUserManager: new FormControl<boolean>(this.permissions.isPuiUserManager),
      isPuiOrganisationManager: new FormControl<boolean>(this.permissions.isPuiOrganisationManager),
      isPuiFinanceManager: new FormControl<boolean>(this.permissions.isPuiFinanceManager),
      isCaseAccessAdmin: new FormControl<boolean>(this.permissions.isCaseAccessAdmin)
    }, { validators: atLeastOneTrueValidator });
  }

  updateCurrentErrors(){
    if (this.permissionsForm.errors?.atLeastOneTrue){
      this.errors.basicPermissions = ['Select at least one permission'];
    } else {
      this.errors.basicPermissions = [];
    }
  }

  private subscribeToAccessTypesChanges() {
    this.permissionsForm.valueChanges.subscribe((permissions) => {
      this.permissions.isPuiUserManager = permissions.isPuiUserManager;
      this.permissions.isPuiOrganisationManager = permissions.isPuiOrganisationManager;
      this.permissions.isPuiFinanceManager = permissions.isPuiFinanceManager;
      this.permissions.isCaseAccessAdmin = permissions.isCaseAccessAdmin;
      this.selectedPermissionsChanged.emit(this.createPermissionsViewModelFromForm());
      this.updateCurrentErrors();
    });
  }

  private createPermissionsViewModelFromInput(): BasicAccessTypes {
    return {
      isPuiUserManager: this.user?.roles?.includes('pui-user-manager'),
      isPuiOrganisationManager: this.user?.roles?.includes('pui-organisation-manager'),
      isPuiFinanceManager: this.user?.roles?.includes('pui-finance-manager'),
      isCaseAccessAdmin: this.user?.roles?.includes('pui-caa')
    };
  }

  private createPermissionsViewModelFromForm(): BasicAccessTypes {
    return {
      isPuiUserManager: this.permissions.isPuiUserManager,
      isPuiOrganisationManager: this.permissions.isPuiOrganisationManager,
      isPuiFinanceManager: this.permissions.isPuiFinanceManager,
      isCaseAccessAdmin: this.permissions.isCaseAccessAdmin
    };
  }
}

interface AccessForm {
  isPuiUserManager: FormControl<boolean>;
  isPuiOrganisationManager: FormControl<boolean>;
  isPuiFinanceManager: FormControl<boolean>;
  isCaseAccessAdmin: FormControl<boolean>;
}

function atLeastOneTrueValidator(group: FormGroup): ValidationErrors | null {
  const controls = Object.values(group.controls);
  if (controls.some((control) => control.value === true)) {
    return null; // return null if at least one control is true
  }
  return { atLeastOneTrue: true }; // return error if none are true
}
