import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from '../../models/environmentConfig.model';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private data: EnvironmentConfig;

  public readonly config$: Observable<EnvironmentConfig>;

  constructor(@Inject(ENVIRONMENT_CONFIG) config: EnvironmentConfig) {
    this.data = config;
    this.config$ = of(config).pipe(shareReplay(1));
  }

  public get<K extends keyof EnvironmentConfig>(key: K): EnvironmentConfig[K] {
    return this.data[key];
  }
}
