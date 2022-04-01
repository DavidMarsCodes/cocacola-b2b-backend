const templateStrategy = require('../../services/templateStrategy');

describe('templateStrategy', () => {
  it('It should select template by status CREATED and return a template of type newOrder_email_template', () => {
    const statusData = 'REGISTERED';
    const templates = {
      CREATED: '{cpgId}_{countryId}_newOrder_email_template',
      DEFAULT: '{cpgId}_{countryId}_tracking_email_template',
      REASON: '{cpgId}_{countryId}_tracking_email_template_reason',
    };

    const res = templateStrategy(statusData, templates);

    expect(res).toEqual('{cpgId}_{countryId}_newOrder_email_template');
  });

  it('It should select template by status DELIVERED_CLT and return a template of type tracking_email_template', () => {
    const statusData = 'DELIVERED_CLT';
    const templates = {
      CREATED: '{cpgId}_{countryId}_newOrder_email_template',
      DEFAULT: '{cpgId}_{countryId}_tracking_email_template',
      REASON: '{cpgId}_{countryId}_tracking_email_template_reason',
    };

    const res = templateStrategy(statusData, templates);

    expect(res).toEqual('{cpgId}_{countryId}_tracking_email_template');
  });

  it('It should select template by status BLOCKED and return a template of type email_template_reason.', () => {
    const statusData = 'BLOCKED';
    const templates = {
      CREATED: '{cpgId}_{countryId}_newOrder_email_template',
      DEFAULT: '{cpgId}_{countryId}_tracking_email_template',
      REASON: '{cpgId}_{countryId}_tracking_email_template_reason',
    };

    const res = templateStrategy(statusData, templates);

    expect(res).toEqual('{cpgId}_{countryId}_tracking_email_template_reason');
  });

  it('It should select template by status RETURNED and return a template of type email_template_reason.', () => {
    const statusData = 'RETURNED';
    const templates = {
      CREATED: '{cpgId}_{countryId}_newOrder_email_template',
      DEFAULT: '{cpgId}_{countryId}_tracking_email_template',
      REASON: '{cpgId}_{countryId}_tracking_email_template_reason',
    };

    const res = templateStrategy(statusData, templates);

    expect(res).toEqual('{cpgId}_{countryId}_tracking_email_template_reason');
  });
});