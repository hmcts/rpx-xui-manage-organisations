import {Component, Input, Output, EventEmitter} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-invite-permission-form',
    templateUrl: './invite-user-permission.component.html',
  })

  export class InviteUserPermissionComponent {
    @Input() inviteUserForm: FormGroup;
    @Input() isInvalid;
    @Input() isPuiCaseManager: boolean = false;
    @Input() isPuiUserManager: boolean = false;
    @Input() isPuiOrganisationManager: boolean = false;
    @Input() isPuiFinanceManager: boolean = false;
  }
