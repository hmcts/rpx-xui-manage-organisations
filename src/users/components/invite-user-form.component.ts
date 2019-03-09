import {Component, Input, Output, EventEmitter} from '@angular/core';
import {UserFromModel} from '../models/userFrom.model';


@Component({
  selector: 'app-invite-user-form',
  template: ` <form [formGroup]="inviteUserForm" (ngSubmit)="onSubmit()" >
    <div class="govuk-form-group" [ngClass]="{'govuk-form-group--error': (isInvalid.firstName && isSubmitted)}">
      <a [name]="isInvalid.firstName"></a>
      <label class="govuk-label govuk-label--m" for="firstname">
        First name(s)
      </label>
      <span id="firstname-hint" class="govuk-hint">
           Include all middle names.
        </span>
      <input class="govuk-input" id="firstName" name="firstName" type="text"
             [ngClass]="{'govuk-input--error': (isInvalid.firstName && isSubmitted)}"
             aria-describedby="firstname-hint" formControlName="firstName">
      <div class="form-control-feedback">
        <p id="event-name-error"
           class="govuk-error-message" *ngIf="isSubmitted && isInvalid.firstName">{{isInvalid.firstName}}</p>
      </div>
    </div>
    <div class="govuk-form-group" [ngClass]="{'govuk-form-group--error': (isInvalid.lastName && isSubmitted)}">
      <label class="govuk-label govuk-label--m" for="lastname">
        Last name
      </label>
      <input class="govuk-input" id="lastName" type="text" formControlName="lastName"
             [ngClass]="{'govuk-input--error': (isInvalid.lastName && isSubmitted)}">
      <div class="form-control-feedback" >
        <p id="event-name-error" class="govuk-error-message"
           *ngIf="isSubmitted && isInvalid.lastName">{{isInvalid.lastName}}</p>
      </div>
    </div>
    <div class="govuk-form-group"
         [ngClass]="{'govuk-form-group--error': ((isInvalid.emailAddress || isInvalid.emailAddressEmail) && isSubmitted)}">
      <label class="govuk-label govuk-label--m" for="emailaddress">
        Email address
      </label>
      <input class="govuk-input" id="emailaddress" formControlName="emailAddress" name="emailaddress" type="text"
             [ngClass]="{'govuk-input--error': ((isInvalid.emailAddress || isInvalid.emailAddressEmail) && isSubmitted)}">
      <div class="form-control-feedback" >
        <p id="event-name-error" class="govuk-error-message"
           *ngIf="isSubmitted && isInvalid.emailAddress">{{isInvalid.emailAddress}}</p>
        <p id="event-name-error" class="govuk-error-message"
           *ngIf="isSubmitted && isInvalid.emailAddressEmail" >{{isInvalid.emailAddressEmail}}</p>
      </div>
    </div>
    <!--permissions -->
    <div class="govuk-form-group" formGroupName="permissions"
         [ngClass]="{'govuk-form-group--error': (isInvalid.permissions && isSubmitted)}">
      <fieldset class="govuk-fieldset" aria-describedby="permissions-hint">
        <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
          Permissions
        </legend>
        <span id="permissions-hint" class="govuk-hint">
              Choose what the user will be able to do. You can change this later.
           </span>
        <div class="form-control-feedback" >
          <p id="event-name-error" class="govuk-error-message"
             *ngIf="isSubmitted && isInvalid.permissions">{{isInvalid.permissions}}</p>
        </div>
        <div class="govuk-checkboxes">
          <div class="govuk-checkboxes__item">
            <input class="govuk-checkboxes__input" name="create_permissions" type="checkbox" formControlName="createCases"
                   value="cases" aria-describedby="permissions-1-item-hint">
            <label class="govuk-label govuk-checkboxes__label" for="permissions-1">
              Create cases
            </label>
            <span id="permissions-1-item-hint" class="govuk-hint govuk-checkboxes__hint">
                    Create, progress and view the status of the user's own cases.
                 </span>
          </div>
          <div class="govuk-checkboxes__item">
            <input class="govuk-checkboxes__input" id="permissions-2" name="view_permissions" formControlName="viewCases"
                   type="checkbox" value="organisation-view" aria-describedby="permissions-2-item-hint">
            <label class="govuk-label govuk-checkboxes__label" for="permissions-2">
              View organisation's cases
            </label>
            <span id="permissions-2-item-hint" class="govuk-hint govuk-checkboxes__hint">
                    View the status of all cases created by the organisation's users.
                 </span>
          </div>
          <div class="govuk-checkboxes__item">
            <input class="govuk-checkboxes__input" id="permissions-3"  name="manage_permissions"
                   type="checkbox" value="users" aria-describedby="permissions-3-item-hint" formControlName="manageUsers">
            <label class="govuk-label govuk-checkboxes__label" for="permissions-3">
              Manage users
            </label>
            <span id="permissions-3-item-hint" class="govuk-hint govuk-checkboxes__hint">
                    View and invite users.
                 </span>
          </div>
          <div class="govuk-checkboxes__item">
            <input class="govuk-checkboxes__input" id="permissions-4"  name="view_org_permissions"
                   type="checkbox" value="organisation" aria-describedby="permissions-4-item-hint" formControlName="viewDetails">
            <label class="govuk-label govuk-checkboxes__label" for="permissions-4">
              View organisation details
            </label>
            <span id="permissions-4-item-hint" class="govuk-hint govuk-checkboxes__hint">
                    View the organisation's name and address.
                 </span>
          </div>
          <div class="govuk-checkboxes__item">
            <input class="govuk-checkboxes__input" id="permissions-5" name="view_fee_permissions"
                   type="checkbox" value="payment" aria-describedby="permissions-5-item-hint" formControlName="viewFees">
            <label class="govuk-label govuk-checkboxes__label" for="permissions-5">
              View fee accounts
            </label>
            <span id="permissions-5-item-hint" class="govuk-hint govuk-checkboxes__hint">
                    View account balances, available credit and transactions.
                 </span>
          </div>
        </div>
      </fieldset>
    </div>

    <!--DATE validation just as POC-->
    <!--<div class="govuk-form-group govuk-form-group&#45;&#45;error" formGroupName="date">-->
    <!--<fieldset class="govuk-fieldset" aria-describedby="passport-issued-hint passport-issued-error" role="group">-->
    <!--<legend class="govuk-fieldset__legend govuk-fieldset__legend&#45;&#45;xl">-->
    <!--<h1 class="govuk-fieldset__heading">-->
    <!--When was your passport issued?-->
    <!--</h1>-->
    <!--</legend>-->
    <!--<span id="passport-issued-hint" class="govuk-hint">-->
    <!--For example, 12 11 2007-->
    <!--</span>-->
    <!--<span id="passport-issued-error" class="govuk-error-message">-->
    <!--<span class="govuk-visually-hidden">Error:</span> The date your passport was issued must be in the past-->
    <!--</span>-->
    <!--<div class="govuk-date-input" id="passport-issued">-->
    <!--<div class="govuk-date-input__item">-->
    <!--<div class="govuk-form-group">-->
    <!--<label class="govuk-label govuk-date-input__label" for="passport-issued-day">-->
    <!--Day-->
    <!--</label>-->
    <!--<input class="govuk-input govuk-date-input__input govuk-input&#45;&#45;width-2 govuk-input&#45;&#45;error"-->
    <!--id="passport-issued-day"-->
    <!--name="passport-issued-day"-->
    <!--type="number"-->
    <!--formControlName="day">-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="govuk-date-input__item">-->
    <!--<div class="govuk-form-group">-->
    <!--<label class="govuk-label govuk-date-input__label" for="passport-issued-month">-->
    <!--Month-->
    <!--</label>-->
    <!--<input class="govuk-input govuk-date-input__input govuk-input&#45;&#45;width-2 govuk-input&#45;&#45;error"-->
    <!--id="passport-issued-month"-->
    <!--name="passport-issued-month"-->
    <!--type="number"-->
    <!--formControlName="month">-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="govuk-date-input__item">-->
    <!--<div class="govuk-form-group">-->
    <!--<label class="govuk-label govuk-date-input__label" for="passport-issued-year">-->
    <!--Year-->
    <!--</label>-->
    <!--<input class="govuk-input govuk-date-input__input govuk-input&#45;&#45;width-4 govuk-input&#45;&#45;error"-->
    <!--id="passport-issued-year"-->
    <!--name="passport-issued-year"-->
    <!--type="number"-->
    <!--formControlName="year">-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</fieldset>-->
    <!--</div>-->

    <button type="submit" class="govuk-button">
      Send invitation
    </button>
  </form>`,
})
export class InviteUserFormComponent {
  @Output() submitForm = new EventEmitter();
  @Input() inviteUserForm;
  @Input() isSubmitted: boolean;
  @Input() set errorMessages(value) {
    this.isInvalid = value || {};
  }

  isInvalid: UserFromModel;

  onSubmit() {
    this.submitForm.emit();
  }
}
