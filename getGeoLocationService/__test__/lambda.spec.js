const handler = require('../lambda');

describe('getGeoLocation initial', () => {
  it('It should generate the location data when receiving an IP.', async () => {

    const event = { ip: '207.97.227.239' };

    const res = { status: jest.fn().mockReturnValue({ json: jest.fn().mockReturnValue(true) }) };

    const geoip = { lookup: jest.fn().mockReturnValue({}) };

    const { getGeoLocation } = handler({ res, geoip });
    const result = await getGeoLocation(event);

    expect(geoip.lookup.mock.calls).toEqual([
      [
        '207.97.227.239',
      ],
    ]);

    expect(res.status.mock.calls).toEqual([ [ 200 ] ]);
    expect(res.status().json.mock.calls).toEqual([
      [
        {},
      ],
    ]);

    expect(result).toEqual(true);

  });
});