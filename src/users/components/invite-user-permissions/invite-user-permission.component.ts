import {Component, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-invite-permission-form',
    templateUrl: './invite-user-permission.component.html',
  })

  export class InviteUserPermissionComponent {
    @Input() public inviteUserForm: FormGroup;
    @Input() public isPuiCaseManager: boolean = false;
    @Input() public isPuiUserManager: boolean = false;
    @Input() public isPuiOrganisationManager: boolean = false;
    @Input() public isPuiFinanceManager: boolean = false;
    @Input() public isCaseAccessAdmin: boolean = false;
    @Input() public errorMessages: {isInvalid: boolean; messages: string[] };
  }
