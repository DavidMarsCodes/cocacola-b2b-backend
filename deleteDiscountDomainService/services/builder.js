const moment = require('moment');

module.exports = {
  buidSortKeyTableDiscountDomainModel: (event) => {
    const date = moment().utcOffset(-3)
      .toISOString(true);
    const data = { ...event };
    const formatedDate = date.substring(0, date.indexOf('T'));
    return `${data.cpgId}-${data.countryId}-${data.organizationId}-${formatedDate}`;
  },
};