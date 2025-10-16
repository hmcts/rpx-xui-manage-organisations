import { Component, Input } from '@angular/core';
import { buildIdOrIndexKey } from 'src/shared/utils/track-by.util';

@Component({
  selector: 'app-fee-account-notification-banner',
  templateUrl: './fee-account-error-notification.component.html',
  standalone: false
})

export class FeeAccountErrorNotificationComponent {
  @Input() public errorMessages: string[];

  public trackByFeeAccountError(index: number, error: string): string | number {
    return buildIdOrIndexKey(index, { value: error } as any, 'value');
  }
}
