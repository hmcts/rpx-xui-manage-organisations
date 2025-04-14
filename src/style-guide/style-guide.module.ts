import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store';
import { styleGuideRouting } from './style-guide.routing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// containers
import * as fromContainers from './containers';

// containers
import * as fromComponents from './components';

@NgModule({ exports: [...fromContainers.containers, ...fromComponents.components],
    declarations: [...fromContainers.containers, ...fromComponents.components], imports: [CommonModule,
        styleGuideRouting,
        SharedModule,
        StoreModule.forFeature('style-guide', reducers),
        FormsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })

/**
 * Entry point to StyleGuideModule
 */

export class StyleGuideModule {}
