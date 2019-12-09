import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// containers
import * as fromContainers from './containers';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [...fromContainers.containers],
  declarations: [...fromContainers.containers]
})

/**
 * Entry point to StyleGuideModule
 */

export class SignedOutModule {}
