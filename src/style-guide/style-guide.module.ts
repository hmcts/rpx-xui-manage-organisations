import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { styleGuideRouting } from './style-guide.routing';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects } from './store';
import { HttpClientModule } from '@angular/common/http';

// containers

import * as fromContainers from './containers';
// containers

import * as fromComponents from './components';
// services

import * as fromServices from './services';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    styleGuideRouting,
    SharedModule,
    StoreModule.forFeature('users', reducers),
    EffectsModule.forFeature(effects),
    FormsModule
  ],
  exports: [...fromContainers.containers, ...fromComponents.components],
  declarations: [...fromContainers.containers,  ...fromComponents.components],
  providers: [...fromServices.services]
})

/**
 * Entry point to StyleGuideModule
 */

export class StyleGuideModule {}
