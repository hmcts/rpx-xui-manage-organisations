import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoaderState } from '../loader.model';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private readonly loaderSubject = new BehaviorSubject<LoaderState>({ show: false });
  public loaderState = this.loaderSubject.asObservable();

  public show() {
    this.loaderSubject.next({ show: true } as LoaderState);
  }

  public hide() {
    this.loaderSubject.next({ show: false } as LoaderState);
  }
}
