import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';
import {HmctsFormBuilderComponent} from './hmcts-form-builder.component';
import {FormBuilderComponent} from './components/form-builder/form-builder.component';
import {FieldsetComponent} from './components/fieldset/fieldset.component';
import {JuiFormElementsComponent} from './components/jui-form-elements/jui-form-elements.component';
import {LegendComponent} from './components/legend/legend.component';
import {HintComponent} from './components/hint/hint.component';
import {DateComponent} from './components/date/date.component';
import {InputsComponent} from './components/inputs/inputs.component';
import {RadiobuttonComponent} from './components/radiobutton/radiobutton.component';
import {CheckboxComponent} from './components/checkbox/checkbox.component';
import {TextareasComponent} from './components/textareas/textareas.component';
import {ButtonsComponent} from './components/buttons/buttons.component';
import {LabelComponent} from './components/label/label.component';
import {HiddenInputComponent} from './components/hidden-input/hidden-input.component';
import {ValidationHeaderComponent} from './components/validation-header/validation-header.component';
import {ValidationErrorFormControlComponent} from './components/validation-error-formcontrol/validation-error-formcontrol.component';
import {ValidationErrorFormGroupComponent} from './components/validation-error-formgroup/validation-error-formgroup.component';
import {FormsService} from './services/form-builder.service';
import {ValidationService} from './services/form-builder-validation.service';
import {ExtensionsComponent} from './components/extensions/extensions.component';

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
]

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
