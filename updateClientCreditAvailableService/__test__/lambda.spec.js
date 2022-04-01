const handler = require('../lambda');

describe('Initial User Validations', () => {
  it('You should update client available', async () => {

    const event = {
      Records: [
        {
          messageId: '292814aa-658a-4693-b525-005e561ee559',
          receiptHandle: 'AQEB1gewyAwf15vZ08jjSLLMHsTFFWBjpIFS7oGHucEUjNqmWP+Z0RVLFWL1DfrEgBi0QG6vDdEp/1xKOEGXEOBVJJUE5gcjsSQg6JuAw90lPKu+QJ2eOeaHLkzabEc+KNOWSOqYoTPQx5wuzcDMu/UZ6Hl+AiAeExFDbyaT0KMwDzy+8AcrZAvVoGSxndTiS4dbuJSKKwie2s7ESzr4F98MToWGxs38wj4upqCT0gSAqa4iKFcqPwIaFPOIdc+5lZ2Ss3dIm2n+1876bdvlvol+Qzb1YFtkcTxRjXFFH4drsSAzgzl/E5/b1YBAEPoG3AEc',
          body: '{"transactionId":"1715ba2d-5b0b-4ba0-883b-c48a0de8a674","Item":{"id":"001-PY-3049-10000849-882","accumulatedBySegments":[{"segmentId":5,"subTotal":56256}]}}',
          attributes: {
            ApproximateReceiveCount: '15',
            SentTimestamp: '1645455097561',
            SequenceNumber: '18867980578685167872',
            MessageGroupId: 'confirmOrder.updateCredit-001-CL-3043-10000849-92',
            SenderId: 'AROAWFKEJJQBSKL3H32BG:tro-aporcel@koandina.com',
            MessageDeduplicationId: '1c150a70-40da-4bf6-8895-63b4ae7b97dc',
            ApproximateFirstReceiveTimestamp: '1645455098587',
          },
          messageAttributes: {},
          md5OfBody: 'cb1f13f0a193a70a065dd74d732ab31d',
          eventSource: 'aws:sqs',
          eventSourceARN: 'arn:aws:sqs:us-east-1:423734365187:b2b-confirmorderserviceupdatecredit-qa.fifo',
          awsRegion: 'us-east-1',
        },
      ],
    };

    const parsedData = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
      cpgId: '001',
      countryId: 'PY',
      organizationId: '3049',
      clientId: 882,
      accumulatedBySegments: [
        { subTotal: 56256, segmentId: 5 },
      ],
    };


    const repositories = jest.fn().mockResolvedValue({
      CreditLimit: {
        getByAvailable: jest.fn().mockResolvedValue([
          { available: 40153039 },
        ]),
        updateAvailable: jest.fn().mockResolvedValue([ 1 ]),
      },
      closeConnection: jest.fn(),
    });

    const experts = {
      creditLimit: {
        validateCreditLimitGetAllRequiredParams: jest.fn(),
        validateExistsResult: jest.fn(),
      },
    };

    const res = { sendStatus: jest.fn().mockReturnValue({ json: jest.fn().mockReturnValue({}) }) };

    const { updateClientCreditAvailableService } = await handler({ repositories, experts, res });

    await updateClientCreditAvailableService(event);

    expect(repositories.mock.calls).toEqual([ [ ] ]);

    expect(experts.creditLimit.validateCreditLimitGetAllRequiredParams.mock.calls).toEqual([
      [
        parsedData,
      ],
    ]);

    const { CreditLimit } = await repositories();

    expect(CreditLimit.getByAvailable.mock.calls).toEqual([
      [
        parsedData,
      ],
    ]);

    expect(CreditLimit.updateAvailable.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'PY',
          organizationId: '3049',
          clientId: 882,
          segmentId: 5,
        },
        NaN,
      ],
    ]);

    expect(res.sendStatus.mock.calls).toEqual([
      [
        200,
      ],
    ]);

  });

  it('It should return a validation error.', async () => {

    const event = {
      Records: [
        {
          messageId: '292814aa-658a-4693-b525-005e561ee559',
          receiptHandle: 'AQEB1gewyAwf15vZ08jjSLLMHsTFFWBjpIFS7oGHucEUjNqmWP+Z0RVLFWL1DfrEgBi0QG6vDdEp/1xKOEGXEOBVJJUE5gcjsSQg6JuAw90lPKu+QJ2eOeaHLkzabEc+KNOWSOqYoTPQx5wuzcDMu/UZ6Hl+AiAeExFDbyaT0KMwDzy+8AcrZAvVoGSxndTiS4dbuJSKKwie2s7ESzr4F98MToWGxs38wj4upqCT0gSAqa4iKFcqPwIaFPOIdc+5lZ2Ss3dIm2n+1876bdvlvol+Qzb1YFtkcTxRjXFFH4drsSAzgzl/E5/b1YBAEPoG3AEc',
          body: '{"transactionId":"1715ba2d-5b0b-4ba0-883b-c48a0de8a674","Item":{"id":"001-PY-3049-10000849-882","accumulatedBySegments":[{"segmentId":5,"subTotal":56256}]}}',
          attributes: {
            ApproximateReceiveCount: '15',
            SentTimestamp: '1645455097561',
            SequenceNumber: '18867980578685167872',
            MessageGroupId: 'confirmOrder.updateCredit-001-CL-3043-10000849-92',
            SenderId: 'AROAWFKEJJQBSKL3H32BG:tro-aporcel@koandina.com',
            MessageDeduplicationId: '1c150a70-40da-4bf6-8895-63b4ae7b97dc',
            ApproximateFirstReceiveTimestamp: '1645455098587',
          },
          messageAttributes: {},
          md5OfBody: 'cb1f13f0a193a70a065dd74d732ab31d',
          eventSource: 'aws:sqs',
          eventSourceARN: 'arn:aws:sqs:us-east-1:423734365187:b2b-confirmorderserviceupdatecredit-qa.fifo',
          awsRegion: 'us-east-1',
        },
      ],
    };

    const parsedData = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
      cpgId: '001',
      countryId: 'PY',
      organizationId: '3049',
      clientId: 882,
      accumulatedBySegments: [
        { subTotal: 56256, segmentId: 5 },
      ],
    };



    const repositories = jest.fn().mockResolvedValue({
      CreditLimit: {
        getByAvailable: jest.fn().mockResolvedValue([
          { available: 40153039 },
        ]),
        updateAvailable: jest.fn().mockResolvedValue([ 1 ]),
      },
      closeConnection: jest.fn(),
    });

    const experts = {
      creditLimit: {
        validateCreditLimitGetAllRequiredParams: jest.fn(() => {
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              httpStatus: 400,
              status: 'error',
              code: 37,
              msg: 'credit_limit_already_exist',
              type: 'Validation_error',
            }),
          };
        }),
        validateExistsResult: jest.fn(),
      },
    };

    const res = {
      sendStatus: jest.fn().mockReturnValue({ json: jest.fn().mockReturnValue({}) }),
      error: jest.fn(),
    };

    const { updateClientCreditAvailableService } = await handler({ repositories, experts, res });

    const result = await updateClientCreditAvailableService(event);

    expect(repositories.mock.calls).toEqual([ [] ]);

    expect(experts.creditLimit.validateCreditLimitGetAllRequiredParams.mock.calls).toEqual([
      [
        parsedData,
      ],
    ]);

    const { CreditLimit } = await repositories();
    expect(CreditLimit.getByAvailable.mock.calls).toEqual([]);

    expect(CreditLimit.updateAvailable.mock.calls).toEqual([]);

    expect(res.sendStatus.mock.calls).toEqual([]);

    expect(res.sendStatus().json.mock.calls).toEqual([]);

    expect(res.error.mock.calls).toEqual([
      [
        'credit_limit_already_exist',
        37,
        'Validation_error',
        400,
      ],
    ]);

  });

  it('It should return a database error.', async () => {

    const event = {
      Records: [
        {
          messageId: '292814aa-658a-4693-b525-005e561ee559',
          receiptHandle: 'AQEB1gewyAwf15vZ08jjSLLMHsTFFWBjpIFS7oGHucEUjNqmWP+Z0RVLFWL1DfrEgBi0QG6vDdEp/1xKOEGXEOBVJJUE5gcjsSQg6JuAw90lPKu+QJ2eOeaHLkzabEc+KNOWSOqYoTPQx5wuzcDMu/UZ6Hl+AiAeExFDbyaT0KMwDzy+8AcrZAvVoGSxndTiS4dbuJSKKwie2s7ESzr4F98MToWGxs38wj4upqCT0gSAqa4iKFcqPwIaFPOIdc+5lZ2Ss3dIm2n+1876bdvlvol+Qzb1YFtkcTxRjXFFH4drsSAzgzl/E5/b1YBAEPoG3AEc',
          body: '{"transactionId":"1715ba2d-5b0b-4ba0-883b-c48a0de8a674","Item":{"id":"001-PY-3049-10000849-882","accumulatedBySegments":[{"segmentId":5,"subTotal":56256}]}}',
          attributes: {
            ApproximateReceiveCount: '15',
            SentTimestamp: '1645455097561',
            SequenceNumber: '18867980578685167872',
            MessageGroupId: 'confirmOrder.updateCredit-001-CL-3043-10000849-92',
            SenderId: 'AROAWFKEJJQBSKL3H32BG:tro-aporcel@koandina.com',
            MessageDeduplicationId: '1c150a70-40da-4bf6-8895-63b4ae7b97dc',
            ApproximateFirstReceiveTimestamp: '1645455098587',
          },
          messageAttributes: {},
          md5OfBody: 'cb1f13f0a193a70a065dd74d732ab31d',
          eventSource: 'aws:sqs',
          eventSourceARN: 'arn:aws:sqs:us-east-1:423734365187:b2b-confirmorderserviceupdatecredit-qa.fifo',
          awsRegion: 'us-east-1',
        },
      ],
    };

    const parsedData = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
      cpgId: '001',
      countryId: 'PY',
      organizationId: '3049',
      clientId: 882,
      accumulatedBySegments: [
        { subTotal: 56256, segmentId: 5 },
      ],
    };


    const repositories = jest.fn().mockResolvedValue({
      CreditLimit: {
        getByAvailable: jest.fn().mockResolvedValue([ {} ]),
        updateAvailable: jest.fn().mockResolvedValue([ 1 ]),
      },
      closeConnection: jest.fn(),
    });

    const experts = {
      creditLimit: {
        validateCreditLimitGetAllRequiredParams: jest.fn(),
        validateExistsResult: jest.fn(),
        handlersDatabaseError: jest.fn(() => ({
          customError: true,
          getData: jest.fn().mockReturnValue({
            httpStatus: undefined,
            status: 'error',
            code: -1,
            msg: undefined,
            type: 'sequelize_error',
            // meta: {
            //   name: 'SequelizeForeignKeyConstraintError',
            //   description: 'Cannot add or update a child row: a foreign key constraint fails (`b2b`.`orderItem`, CONSTRAINT `orderItem_prod_FK` FOREIGN KEY (`productId`) REFERENCES `product` (`productId`))',
            //   fields: [ 'clientId' ],
            // },
          }),
        })),
      },
    };

    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn().mockReturnValue({}) }),
      error: jest.fn().mockResolvedValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };

    const { updateClientCreditAvailableService } = await handler({ repositories, experts, res });

    await updateClientCreditAvailableService(event);

    expect(repositories.mock.calls).toEqual([ [] ]);

    expect(experts.creditLimit.validateCreditLimitGetAllRequiredParams.mock.calls).toEqual([
      [
        parsedData,
      ],
    ]);

    const { CreditLimit, closeConnection } = await repositories();
    expect(CreditLimit.getByAvailable.mock.calls).toEqual([
      [
        parsedData,
      ],
    ]);

    expect(experts.creditLimit.validateExistsResult.mock.calls).toEqual([ [ [ 1 ] ] ]);


    expect(CreditLimit.updateAvailable.mock.calls).toEqual([ [
      {
        cpgId: '001',
        countryId: 'PY',
        organizationId: '3049',
        clientId: 882,
        segmentId: 5,
      },
      NaN,
    ] ]);

    expect(experts.creditLimit.handlersDatabaseError).toHaveBeenCalled();
    expect(res.error.mock.calls).toEqual([
      [

        undefined,
        -1,
        'sequelize_error',
        undefined,
        undefined,

      ],
    ]);
    expect(res.status.mock.calls).toEqual([]);

    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });
});