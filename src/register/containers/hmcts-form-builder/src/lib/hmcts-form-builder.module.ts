import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonsComponent } from './components/buttons/buttons.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { DateComponent } from './components/date/date.component';
import { ExtensionsComponent } from './components/extensions/extensions.component';
import { FieldsetComponent } from './components/fieldset/fieldset.component';
import { FormBuilderComponent } from './components/form-builder/form-builder.component';
import { HiddenInputComponent } from './components/hidden-input/hidden-input.component';
import { HintComponent } from './components/hint/hint.component';
import { InputButtonComponent } from './components/input-button/input-button.component';
import { InputsComponent } from './components/inputs/inputs.component';
import { JuiFormElementsComponent } from './components/jui-form-elements/jui-form-elements.component';
import { LabelComponent } from './components/label/label.component';
import { LegendComponent } from './components/legend/legend.component';
import { RadiobuttonComponent } from './components/radiobutton/radiobutton.component';
import { TextareasComponent } from './components/textareas/textareas.component';
import { ValidationErrorFormControlComponent } from './components/validation-error-formcontrol/validation-error-formcontrol.component';
import { ValidationErrorFormGroupComponent } from './components/validation-error-formgroup/validation-error-formgroup.component';
import { ValidationHeaderComponent } from './components/validation-header/validation-header.component';
import { HmctsFormBuilderComponent } from './hmcts-form-builder.component';
import { ValidationService } from './services/form-builder-validation.service';
import { FormsService } from './services/form-builder.service';

const COMPONENTS = [
  FormBuilderComponent,
  FieldsetComponent,
  ValidationErrorFormGroupComponent,
  FieldsetComponent,
  JuiFormElementsComponent,
  LegendComponent,
  HintComponent,
  DateComponent,
  InputsComponent,
  InputButtonComponent,
  RadiobuttonComponent,
  CheckboxComponent,
  TextareasComponent,
  ButtonsComponent,
  LabelComponent,
  HiddenInputComponent,
  ValidationHeaderComponent,
  ValidationErrorFormControlComponent,
  HmctsFormBuilderComponent,
  ExtensionsComponent
];

const SERVICES = [
  FormsService,
  ValidationService,
  DatePipe
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [
    ...SERVICES
  ]
})
// TODO remove this module and make it part of te compoent.
export class HmctsFormBuilderModule {
}
