import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { checkboxesBeCheckedValidator } from 'src/custom-validators/checkboxes-be-checked.validator';

@Component({
    selector: 'edit-user-permission',
    templateUrl: './edit-user-permission.component.html',
  })
  export class EditUserPermissionComponent  implements OnInit {
    inviteUserForm: FormGroup;
    isInvalid;
    ngOnInit(): void {
      this.inviteUserForm = new FormGroup({
        roles: new FormGroup({
          'pui-case-manager': new FormControl(''),
          'pui-user-manager': new FormControl(''),
          'pui-organisation-manager': new FormControl('')
        }, checkboxesBeCheckedValidator())
      });
    }
  }
