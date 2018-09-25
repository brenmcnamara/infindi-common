"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});


/**
 * Structure representing the year, month, and day of date (in UTC).
 *
 * NOTE: month uses 0-based indexing. day and year use 1-based indexing
 */
class YearMonthDay {

  constructor(year, month, day) {
    this._year = year;
    this._month = month;
    this._day = day;
  }

  static create(year, monthIndex, day) {
    return new YearMonthDay(year, monthIndex, day);
  }

  static now() {
    const now = new Date();
    return YearMonthDay.create(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  }

  get year() {
    return this._year;
  }

  get month() {
    return this._month;
  }

  get day() {
    return this._day;
  }

  compare(ymd) {
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
exports.default = YearMonthDay;