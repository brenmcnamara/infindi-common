/* @flow */

/**
 * Structure representing the year, month, and day of date (in UTC).
 *
 * NOTE: month uses 0-based indexing. day and year use 1-based indexing
 */
export default class YearMonthDay {
  _day: number;
  _month: number;
  _year: number;

  constructor(year: number, month: number, day: number) {
    this._year = year;
    this._month = month;
    this._day = day;
  }

  static create(year: number, monthIndex: number, day: number): YearMonthDay {
    return new YearMonthDay(year, monthIndex, day);
  }

  static now(): YearMonthDay {
    const now = new Date();
    return YearMonthDay.create(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    );
  }

  get year(): number {
    return this._year;
  }

  get month(): number {
    return this._month;
  }

  get day(): number {
    return this._day;
  }

  compare(ymd: YearMonthDay): -1 | 0 | 1 {
    if (this.year > ymd.year) {
      return 1;
    } else if (this.year < ymd.year) {
      return -1;
    } else if (this.month > ymd.month) {
      return 1;
    } else if (this.month < ymd.month) {
      return -1;
    } else if (this.day > ymd.day) {
      return 1;
    } else if (this.day < ymd.day) {
      return -1;
    }
    return 0;
  }
}
