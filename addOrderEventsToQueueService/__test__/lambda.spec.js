const handler = require('../lambda');

describe('Lambda Function add order event to queue service', () => {

  it('Send message to the queue.', async () => {

    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      erpOrderId: '0204268914',
      orderId: 832,
      orderStatus: 'RETURNED',
      sourceChannel: 'B2B',
      email: 'xxx.zzzz@domain.com',
      amount: 58977,
      erpClientId: 'fdaffa68828822',
      reason: 'No se encontro en el domicilio.',
      name: 'Nicolas',
      sourceChannel: 'B2B',
    };

    const typesOfStates = {
      TRANSIT: 'TRANSIT',
      DELIVERED_CLT: 'DELIVERED_CLT',
      RETURNED: 'RETURNED',
      BLOCKED: 'BLOCKED',
      CANCELLED: 'CANCELLED',
      REGISTERED: 'REGISTERED',
    };

    const notificationStatus = { isEnabled: jest.fn().mockReturnValue(true) };

    const builder = {
      queueMessage: jest.fn().mockReturnValue({
        cpgId: '001',
        countryId: 'CL',
        organizationId: '3043',
        erpOrderId: '0204268914',
        orderId: 832,
        orderStatus: 'RETURNED',
        email: 'xxx.zzzz@domain.com',
        amount: 58977,
        reason: 'No se encontro en el domicilio.',
        name: 'Nicolas',
      }),
    };

    const getInstanceQueue = jest.fn().mockResolvedValue({ send: jest.fn().mockResolvedValue() });

    const { addOrderEventsToQueue } = handler({ typesOfStates, notificationStatus, builder, getInstanceQueue });

    await addOrderEventsToQueue(event);

    expect(notificationStatus.isEnabled.mock.calls).toEqual([
      [
        {
          TRANSIT: 'TRANSIT',
          DELIVERED_CLT: 'DELIVERED_CLT',
          RETURNED: 'RETURNED',
          BLOCKED: 'BLOCKED',
          CANCELLED: 'CANCELLED',
          REGISTERED: 'REGISTERED',
        },
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          erpOrderId: '0204268914',
          orderId: 832,
          orderStatus: 'RETURNED',
          sourceChannel: 'B2B',
          email: 'xxx.zzzz@domain.com',
          amount: 58977,
          erpClientId: 'fdaffa68828822',
          reason: 'No se encontro en el domicilio.',
          name: 'Nicolas',
          sourceChannel: 'B2B',
        },
      ],
    ]);

    expect(builder.queueMessage.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          erpOrderId: '0204268914',
          orderId: 832,
          orderStatus: 'RETURNED',
          sourceChannel: 'B2B',
          email: 'xxx.zzzz@domain.com',
          amount: 58977,
          erpClientId: 'fdaffa68828822',
          reason: 'No se encontro en el domicilio.',
          name: 'Nicolas',
          sourceChannel: 'B2B',
        },
      ],
    ]);

    expect(getInstanceQueue.mock.calls).toEqual([ [] ]);


    const queues = await getInstanceQueue();
    expect(queues.send.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          erpOrderId: '0204268914',
          orderId: 832,
          orderStatus: 'RETURNED',
          email: 'xxx.zzzz@domain.com',
          amount: 58977,
          reason: 'No se encontro en el domicilio.',
          name: 'Nicolas',
        },
      ],
    ]);

  });

});