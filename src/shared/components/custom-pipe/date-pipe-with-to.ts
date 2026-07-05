import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormatAtTime',
  standalone: false
})
export class DateFormatAtTimePipe implements PipeTransform {
  public transform(date: Date, is24Hour: boolean): string {
    const time = is24Hour
      ? this.format24HourTime(date)
      : this.format12HourTime(date);

    return `${formatDate(date, 'dd MMM yyyy', 'en-UK')} at ${time}`;
  }

  private format24HourTime(date: Date): string {
    return formatDate(date, 'HH:mm', 'en-UK');
  }

  private format12HourTime(date: Date): string {
    return formatDate(date, 'h:mm a', 'en-UK').toLowerCase();
  }
}
