import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {FormDataValuesModel} from '../../models/form-data-values.model';
import * as fromStore from '../../store';

/**
 * Stateless component responsible for
 * displaying and submitting user's inputted data.
 */

@Component({
  selector: 'app-check-your-answers',
  templateUrl: './check-your-answers.component.html',
})
export class CheckYourAnswersComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private readonly store: Store<fromStore.RegistrationState>
  ) {}

  public formDataValues: FormDataValuesModel;
  public errorMessageDetails: any;
  public errorMessageDetailsCode: any;

  @Output() public submit = new EventEmitter();
  @Input() public set fromValues(values: FormDataValuesModel) {
    this.formDataValues = values;
  }

  public ngOnInit(): void {
    this.errorMessageDetails = this.store.pipe(select(fromStore.getErrorMessages));
    this.errorMessageDetailsCode = this.store.pipe(select(fromStore.getErrorMessagesCodes));
  }

  // Set to focus to the title when the page started for accessibility
  public ngAfterViewInit() {
    const focusElement = document.getElementsByTagName('h1')[0];
    if (focusElement) {
      focusElement.setAttribute('tabindex', '-1');
      focusElement.focus();
    }

  }

  public ngOnDestroy(): void {
    this.store.dispatch(new fromStore.ResetErrorMessage({}));
    this.store.dispatch(new fromStore.ResetErrorMessageCode({}));
  }

  public onSubmitData() {
    this.submit.emit();
  }

}
