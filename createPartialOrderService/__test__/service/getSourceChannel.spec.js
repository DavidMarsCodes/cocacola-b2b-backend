const getSourceChannel = require('../../services/getSourceChannel');

describe('getSourceChannel method', () => {
  it('should return source channel "b2b"', () => {
    const applicationClientName = 'b2b-b2b-appclient-dev';

    const res = getSourceChannel(applicationClientName);

    expect(res).toEqual('B2B');
  });

  it('should return source channel "koboss"', () => {
    const applicationClientName = 'b2b-koboss-appclient-dev';

    const res = getSourceChannel(applicationClientName);

    expect(res).toEqual('KOBOSS');
  });
});