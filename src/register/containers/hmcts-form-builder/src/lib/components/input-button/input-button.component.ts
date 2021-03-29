import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromStore from '../../../../../../store';
import { ValidationService } from '../../services/form-builder-validation.service';

@Component({
  selector: 'app-input-button',
  templateUrl: './input-button.component.html',
  styleUrls: ['./input-button.component.scss']
})
export class InputButtonComponent implements OnInit {
  @Input() public group: FormGroup;
  @Input() public item;
  @Input() public label;
  @Input() public hint;
  @Input() public labelFor;
  @Input() public showValidation = true;
  @Input() public validationErrors: any[];
  @Input() public validationError;
  @Output() public btnClick = new EventEmitter();

  public pages$: Observable<any>;
  public showRemoveButton: boolean = false;

  public name: string;
  public id: string;

  constructor(private readonly store: Store<fromStore.RegistrationState>,
              private validationService: ValidationService) {
  }

  public ngOnInit(): void {
    this.pages$ = this.store.pipe(select(fromStore.getRegistrationPages));
    this.pages$.subscribe(pages => {
      const groups: [] = pages['organisation-pba'].meta.groups;
      let pbaCount = 0;
      groups.forEach(group => {
        // @ts-ignore
        if (group.hasOwnProperty('inputButton')) {
          pbaCount++;
        }
      });
      this.showRemoveButton = pbaCount > 1;
    });
  }

  public isControlInvalid(formGroup: FormGroup, control: string) {
    return !this.isFormControlValid(formGroup, control);
  }

  public isFormControlValid(formGroup: FormGroup, control: string): boolean {
    return this.validationService.isFormControlValid(formGroup, control);
  }

  public hasValidationError(formGroup: FormGroup, control: string): boolean {
    if (formGroup.controls[control] && formGroup.controls[control].errors) {
      for (const key of Object.keys(formGroup.controls[control].errors)) {
        if (key === 'duplicatedPBAError') {
          this.validationError = this.validationErrors[0].text;
        } else {
          this.validationError = this.validationErrors[1].text;
        }
      }
      return true;
    }
    return false;
  }

  public removeItem(event) {
    this.btnClick.emit(event.target.id);
  }

  public onBlur(event) {
    if (event.target.value && !event.target.value.toUpperCase().startsWith('PBA')) {
      this.group.controls[event.target.id].setValue(`PBA${event.target.value}`);
    } else if (event.target.value && event.target.value.toUpperCase().startsWith('PBA')) {
      this.group.controls[event.target.id].setValue(event.target.value.replace(/pba/gi, 'PBA'));
    }
  }
}
