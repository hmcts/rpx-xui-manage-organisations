import { NgModule } from '@angular/core'
import {GovUiModule} from '../../../projects/gov-ui/src/lib/gov-ui.module';

@NgModule( {
  exports: [GovUiModule]
})
export class SharedModule {
}
