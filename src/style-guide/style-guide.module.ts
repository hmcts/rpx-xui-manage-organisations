import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
// containers
import * as fromComponents from './components';
// containers
import * as fromContainers from './containers';
import { reducers } from './store';
import { styleGuideRouting } from './style-guide.routing';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    styleGuideRouting,
    SharedModule,
    StoreModule.forFeature('style-guide', reducers),
    FormsModule,
    ExuiCommonLibModule.forChild()
  ],
  exports: [...fromContainers.containers, ...fromComponents.components],
  declarations: [...fromContainers.containers,  ...fromComponents.components]
})

/**
 * Entry point to StyleGuideModule
 */

export class StyleGuideModule {}
