import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs/operators';
import { EnvironmentConfig } from '../../models/environmentConfig.model';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private data: EnvironmentConfig;

  public readonly config$ = this.http.get<EnvironmentConfig>('/external/configuration-ui')
    .pipe<EnvironmentConfig>(shareReplay<EnvironmentConfig>(1));

  constructor(private readonly http: HttpClient) {
    this.config$.subscribe((config) => {
      this.data = config;
    });
  }

  public get<K extends keyof EnvironmentConfig>(key: K): EnvironmentConfig[K] {
    return this.data[key];
  }
}
