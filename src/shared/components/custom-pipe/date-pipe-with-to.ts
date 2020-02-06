import {formatDate} from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'dateFormatAtTime'})
export class DateFormatAtTimePipe implements PipeTransform {
  public transform(date: Date, is24Hour: boolean): string {
    return `${formatDate(date, 'dd MMM yyyy', 'en-UK')} at ${this.formatTime(date, is24Hour)}`;
  }

  private formatTime(date: Date, is24Hour: boolean): string {
    return is24Hour ? formatDate(date, 'HH:mm', 'en-UK') : formatDate(date, 'h:mm a', 'en-UK').toLowerCase();
  }
}
