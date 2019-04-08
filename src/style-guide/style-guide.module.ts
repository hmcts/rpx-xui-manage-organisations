import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store';
import { styleGuideRouting } from './style-guide.routing';
import { HttpClientModule } from '@angular/common/http';

// containers
import * as fromContainers from './containers';

// containers
import * as fromComponents from './components';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    styleGuideRouting,
    SharedModule,
    StoreModule.forFeature('style-guide', reducers),
    FormsModule
  ],
  exports: [...fromContainers.containers, ...fromComponents.components],
  declarations: [...fromContainers.containers,  ...fromComponents.components]
})

/**
 * Entry point to StyleGuideModule
 */

export class StyleGuideModule {}
