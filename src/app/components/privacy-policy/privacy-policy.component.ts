import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  standalone: false
})
export class PrivacyPolicyComponent implements OnInit {
  constructor(private readonly route: ActivatedRoute) {}

  private subscription: Subscription;

  public ngOnInit(): void {
    this.subscription = this.route.fragment.subscribe((fragment) => {
      try {
        document.querySelector(`#${fragment}`).scrollIntoView();
        // eslint-disable-next-line no-empty
      } catch (e) {}
    });
  }

  @HostListener('document:click', ['$event'])
  public clickout() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.route.fragment.subscribe((fragment) => {
      try {
        document.querySelector(`#${fragment}`).scrollIntoView();
        // eslint-disable-next-line no-empty
      } catch (e) {}
    });
  }
}
