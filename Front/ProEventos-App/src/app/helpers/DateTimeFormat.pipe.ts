import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../util/constants';

@Pipe({
  name: 'DateTimeFormat',
  standalone: true
})
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {

  constructor() {
    super('en-US');
  }

  override transform(value: any, args?: any): any {
    if (typeof value === 'string') {
      const dateParts = value.split(/[\s\/:]+/);
      if (dateParts.length === 6) {
        const [day, month, year, hour, minute, second] = dateParts.map(Number);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year) && !isNaN(hour) && !isNaN(minute) && !isNaN(second)) {
          value = new Date(year, month - 1, day, hour, minute, second);
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
    return super.transform(value, Constants.DTE_TIME_FMT);
  }
}
