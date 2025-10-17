import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoaderState } from '../loader.model';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone: false
})
export class LoaderComponent implements OnInit, OnDestroy {
  public show = false;
  private subscription: Subscription;

  constructor(private readonly loaderService: LoaderService) {}

  public ngOnInit(): void {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
