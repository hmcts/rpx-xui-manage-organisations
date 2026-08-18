import { DateFormatAtTimePipe } from './date-pipe-with-to';

describe('DateFormatAtTimePipe', () => {
  let pipe: DateFormatAtTimePipe;
  const date = new Date(2026, 6, 7, 14, 5);

  beforeEach(() => {
    pipe = new DateFormatAtTimePipe();
  });

  it('should format dates with 24 hour time', () => {
    expect(pipe.transform(date, true)).toBe('07 Jul 2026 at 14:05');
  });

  it('should format dates with 12 hour time', () => {
    expect(pipe.transform(date, false)).toBe('07 Jul 2026 at 2:05 pm');
  });
});
