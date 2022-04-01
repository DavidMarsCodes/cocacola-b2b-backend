const { createOrUpdate } = require('../../../services/strategies/strategy/update');

describe('update', () => {

  it('updating deliveryfrozen if exist in redis', async () => {

    const opdates = jest.fn().mockResolvedValue({
      pricesDate: '2021-10-18T15:32:53.197-03:00',
      deliverydate: {
        visitDate: '2021-10-19T00:00:00.000Z',
        visitPlanId: 8283,
        visitType: 'delivery',
      },
      deliveryfrozen: {
        visitDate: '2021-10-23T00:00:00.000Z',
        visitPlanId: 12355,
        visitType: 'deliveryfrozen',
      },
    });

    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 1,
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
      visitType: 'deliveryfrozen',
      deliverydate: '2021-10-25T00:00:00.000Z',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJZejk3Q05TSGl1RitOWVJkeTJOUVNZbTFmb0d2dXJZenJCNGxucDJZQ1BJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjYTcxMGE0ZS0wZjdjLTQ4NDUtYWQ2Yy0yOWRjMDcwNjNiYWIiLCJjb2duaXRvOmdyb3VwcyI6WyJpbnZva2UtYXBpIl0sImNvZ25pdG86cHJlZmVycmVkX3JvbGUiOiJhcm46YXdzOmlhbTo6NTgzMDgxNzg0MzEzOnJvbGVcL2lhbV9yX2NvZ25pdG9fc2VjdXJlX2ludm9rZS1hcGkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9Xem80djhldzUiLCJjb2duaXRvOnVzZXJuYW1lIjoiY2E3MTBhNGUtMGY3Yy00ODQ1LWFkNmMtMjlkYzA3MDYzYmFiIiwib3JpZ2luX2p0aSI6IjllMDM3MmJmLTk4ODctNGJjMi1hNTI1LTJjM2QyZDE2MTczMSIsImNvZ25pdG86cm9sZXMiOlsiYXJuOmF3czppYW06OjU4MzA4MTc4NDMxMzpyb2xlXC9pYW1fcl9jb2duaXRvX3NlY3VyZV9pbnZva2UtYXBpIl0sImF1ZCI6IjFlYzlsMjc1OWdkZ2FzNTNoam9xcWJzdGF0IiwiZXZlbnRfaWQiOiIwYWYyYjNlYy0wNTllLTRiMmMtOTgyMy0zYWZjNWUxZjIwMDYiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTYzNDU4NzAzMSwicGhvbmVfbnVtYmVyIjoiKzU2MTExMTExMTExMSIsImV4cCI6MTYzNDU5MDYzMSwiaWF0IjoxNjM0NTg3MDMxLCJqdGkiOiJlNzhlNWFhZS01MGMwLTQyY2EtYWFmYS00Y2E4MzhlYzVjOTkiLCJlbWFpbCI6ImFsZXhpcy5wb3JjZWxAaW5jbHVpdC5jb20ifQ.Fl2gA8iQjrqdwWx5VqH4VMkmYZ573zjKfRhPs-OG1d9v4Sr8Pr3cqRo523r1p65jP0FctkagUHRCPj_y0V5mgBgA7wIWb93MSjB2qmR0IcM-lWNeT-j7H6QaSZwDRcptKABPBXjstro3RnOZcFpDHBs9h3QRYzY39Ft4avXQ4kaX9j-uzYBdpCSE_lZ2gsDEf_fVSPW8f8Nazc9rrXWH8Rhsn0qAbxZhbj0NYhyaZyXve4LEkg7fRZ-YoWLt3yqg0wFkpKwDnfPdd8v2bNbUYhazqZ4IIP_PGo6_JSsIKr0DTGSO6GW6nS7K3t87FLJDVwe5D1Yp8XNfOIZldgk3mg' },
      deliveryType: [ 'delivery', 'deliveryfrozen' ],
    };

    const visitPlan = {
      deliveryfrozen: {
        visitDate: '2021-10-25T00:00:00.000Z',
        visitPlanId: 12356,
        visitType: 'deliveryfrozen',
      },
    };

    const experts = '2021-10-18T17:07:13.905-03:00';

    const parameters = 'CURRENT_DATE';

    const updateMethod = await createOrUpdate({ opdates, event, visitPlan, experts, parameters });

    // Happy path
    expect(updateMethod).toEqual(opdates);


  });

  it('updating deliverydate if exist in redis', async () => {

    const opdates = jest.fn().mockResolvedValue({
      pricesDate: '2021-10-18T15:32:53.197-03:00',
      deliverydate: {
        visitDate: '2021-10-19T00:00:00.000Z',
        visitPlanId: 8283,
        visitType: 'delivery',
      },
      deliveryfrozen: {
        visitDate: '2021-10-23T00:00:00.000Z',
        visitPlanId: 12355,
        visitType: 'deliveryfrozen',
      },
    });

    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 1,
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
      visitType: 'delivery',
      deliverydate: '2021-10-20T00:00:00.000Z',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJZejk3Q05TSGl1RitOWVJkeTJOUVNZbTFmb0d2dXJZenJCNGxucDJZQ1BJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjYTcxMGE0ZS0wZjdjLTQ4NDUtYWQ2Yy0yOWRjMDcwNjNiYWIiLCJjb2duaXRvOmdyb3VwcyI6WyJpbnZva2UtYXBpIl0sImNvZ25pdG86cHJlZmVycmVkX3JvbGUiOiJhcm46YXdzOmlhbTo6NTgzMDgxNzg0MzEzOnJvbGVcL2lhbV9yX2NvZ25pdG9fc2VjdXJlX2ludm9rZS1hcGkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9Xem80djhldzUiLCJjb2duaXRvOnVzZXJuYW1lIjoiY2E3MTBhNGUtMGY3Yy00ODQ1LWFkNmMtMjlkYzA3MDYzYmFiIiwib3JpZ2luX2p0aSI6IjllMDM3MmJmLTk4ODctNGJjMi1hNTI1LTJjM2QyZDE2MTczMSIsImNvZ25pdG86cm9sZXMiOlsiYXJuOmF3czppYW06OjU4MzA4MTc4NDMxMzpyb2xlXC9pYW1fcl9jb2duaXRvX3NlY3VyZV9pbnZva2UtYXBpIl0sImF1ZCI6IjFlYzlsMjc1OWdkZ2FzNTNoam9xcWJzdGF0IiwiZXZlbnRfaWQiOiIwYWYyYjNlYy0wNTllLTRiMmMtOTgyMy0zYWZjNWUxZjIwMDYiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTYzNDU4NzAzMSwicGhvbmVfbnVtYmVyIjoiKzU2MTExMTExMTExMSIsImV4cCI6MTYzNDU5MDYzMSwiaWF0IjoxNjM0NTg3MDMxLCJqdGkiOiJlNzhlNWFhZS01MGMwLTQyY2EtYWFmYS00Y2E4MzhlYzVjOTkiLCJlbWFpbCI6ImFsZXhpcy5wb3JjZWxAaW5jbHVpdC5jb20ifQ.Fl2gA8iQjrqdwWx5VqH4VMkmYZ573zjKfRhPs-OG1d9v4Sr8Pr3cqRo523r1p65jP0FctkagUHRCPj_y0V5mgBgA7wIWb93MSjB2qmR0IcM-lWNeT-j7H6QaSZwDRcptKABPBXjstro3RnOZcFpDHBs9h3QRYzY39Ft4avXQ4kaX9j-uzYBdpCSE_lZ2gsDEf_fVSPW8f8Nazc9rrXWH8Rhsn0qAbxZhbj0NYhyaZyXve4LEkg7fRZ-YoWLt3yqg0wFkpKwDnfPdd8v2bNbUYhazqZ4IIP_PGo6_JSsIKr0DTGSO6GW6nS7K3t87FLJDVwe5D1Yp8XNfOIZldgk3mg' },
      deliveryType: [ 'delivery', 'deliveryfrozen' ],
    };

    const visitPlan = {
      deliveryfrozen: {
        visitDate: '2021-10-20T00:00:00.000Z',
        visitPlanId: 12356,
        visitType: 'delivery',
      },
    };

    const experts = { portfolio: { priceDateByCountry: jest.fn().mockReturnValue('2021-10-18T17:07:13.905-03:00') } };

    const parameters = { Item: { params: { DATE_FOR_OPERATIONS: 'CURRENT_DATE' } } };

    const updateMethod = await createOrUpdate({ opdates, event, visitPlan, experts, parameters });

    // Happy path
    expect(updateMethod).toEqual(opdates);


  });
});