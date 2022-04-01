const moment = require('moment');

class HandlerDates {
  static format(date, format) {
    date = moment(date).format(format);// .toISOString();

    return date;
  }
}

module.exports = HandlerDates;