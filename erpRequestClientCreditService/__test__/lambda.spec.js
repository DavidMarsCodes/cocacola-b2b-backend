const handler = require('../lambda');

beforeAll(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date('2021-02-18'));
});

describe('Lambda Function', () => {

  it('It should answer a status 201.', async () => {

    const repositories = jest.fn().mockResolvedValue({
      ClientUser: {
        getClientIdAndErpIdByUserName: jest.fn().mockResolvedValue(
          [
            { Client: { clientId: 1, erpClientId: '0500266098' } },
            { Client: { clientId: 127, erpClientId: '0500301148' } },
          ],
        ),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const getErpConfig = jest.fn().mockResolvedValue({});

    const erpManager = {
      updateConfig: jest.fn(),
      save: jest.fn().mockResolvedValue(),
    };

    const res = {
      sendStatus: jest.fn((code) => ({ httpStatus: code })),
      error: jest.fn(),
    };

    const event = {
      Records: [
        {
          messageId: '292814aa-658a-4693-b525-005e561ee559',
          receiptHandle: 'AQEB1gewyAwf15vZ08jjSLLMHsTFFWBjpIFS7oGHucEUjNqmWP+Z0RVLFWL1DfrEgBi0QG6vDdEp/1xKOEGXEOBVJJUE5gcjsSQg6JuAw90lPKu+QJ2eOeaHLkzabEc+KNOWSOqYoTPQx5wuzcDMu/UZ6Hl+AiAeExFDbyaT0KMwDzy+8AcrZAvVoGSxndTiS4dbuJSKKwie2s7ESzr4F98MToWGxs38wj4upqCT0gSAqa4iKFcqPwIaFPOIdc+5lZ2Ss3dIm2n+1876bdvlvol+Qzb1YFtkcTxRjXFFH4drsSAzgzl/E5/b1YBAEPoG3AEc',
          body: '{"cpgId":"001","countryId":"CL","organizationId":"3043","username":"d90e584f-9def-4dc1-9511-49ce3af0da78"}',
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

    const awsRepositories = { Repository: { batchCreate: jest.fn().mockResolvedValue({}) } };

    const getTableName = jest.fn().mockResolvedValue({ DYNAMODB_TABLE_NAME: 'devCreditRequestUpdate' });

    const experts = { client: { validateExistsResult: jest.fn() } };
    const { erpClientCredit } = handler({ getErpConfig, erpManager, res, awsRepositories, getTableName, repositories, experts });

    const result = await erpClientCredit(event);

    expect(repositories.mock.calls).toEqual([ [] ]);

    expect(getErpConfig.mock.calls).toEqual([ [] ]);

    expect(getTableName.mock.calls).toEqual([ [] ]);

    expect(awsRepositories.Repository.batchCreate.mock.calls).toEqual([ [
      'devCreditRequestUpdate', [ {
        createdTime: '2021-02-18T00:00:00.000Z',
        id: '001-CL-3043-0500266098',
        clientId: 1,
        status: 'ACTIVE',
      },
      {
        createdTime: '2021-02-18T00:00:00.000Z',
        id: '001-CL-3043-0500301148',
        clientId: 127,
        status: 'ACTIVE',
      },
      ],
    ],
    ]);

    expect(erpManager.updateConfig.mock.calls).toEqual([ [ {} ] ]);

    expect(erpManager.save.mock.calls).toEqual([ [
      {
        erpClientIdList: [
          {
            countryId: 'CL',
            cpgId: '001',
            erpClientId: '0500266098',
            organizationId: '3043',
          },
          {
            countryId: 'CL',
            cpgId: '001',
            erpClientId: '0500301148',
            organizationId: '3043',
          },
        ],
      },
    ],
    ]);

    expect(result).toEqual({ httpStatus: 201 });

  });

  it('It should return a server_error in case of an unhandled error.', async () => {

    const event = {
      Records: [
        {
          messageId: '292814aa-658a-4693-b525-005e561ee559',
          receiptHandle: 'AQEB1gewyAwf15vZ08jjSLLMHsTFFWBjpIFS7oGHucEUjNqmWP+Z0RVLFWL1DfrEgBi0QG6vDdEp/1xKOEGXEOBVJJUE5gcjsSQg6JuAw90lPKu+QJ2eOeaHLkzabEc+KNOWSOqYoTPQx5wuzcDMu/UZ6Hl+AiAeExFDbyaT0KMwDzy+8AcrZAvVoGSxndTiS4dbuJSKKwie2s7ESzr4F98MToWGxs38wj4upqCT0gSAqa4iKFcqPwIaFPOIdc+5lZ2Ss3dIm2n+1876bdvlvol+Qzb1YFtkcTxRjXFFH4drsSAzgzl/E5/b1YBAEPoG3AEc',
          body: '{"cpgId":"001","countryId":"CL","organizationId":"3043","username":"d90e584f-9def-4dc1-9511-49ce3af0da78"}',
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

    const repositories = jest.fn().mockResolvedValue({
      ClientUser: { getClientIdAndErpIdByUserName: jest.fn().mockResolvedValue([]) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const getErpConfig = jest.fn().mockResolvedValue({});

    const erpManager = {
      updateConfig: jest.fn(),
      save: jest.fn().mockResolvedValue(),
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

    const awsRepositories = { Repository: { batchCreate: jest.fn().mockResolvedValue({}) } };

    const getTableName = jest.fn().mockResolvedValue({ DYNAMODB_TABLE_NAME: 'devCreditRequestUpdate' });

    const experts = {
      client: {
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

    const { erpClientCredit } = handler({ getErpConfig, erpManager, res, awsRepositories, getTableName, repositories, experts });

    await erpClientCredit(event);

    expect(repositories.mock.calls).toEqual([ [] ]);

    expect(getErpConfig.mock.calls).toEqual([ [] ]);

    const { ClientUser } = await repositories();

    expect(ClientUser.getClientIdAndErpIdByUserName.mock.calls).toEqual([ [ 'd90e584f-9def-4dc1-9511-49ce3af0da78' ] ]);


    expect(getTableName.mock.calls).toEqual([ [] ]);
    expect(erpManager.updateConfig.mock.calls).toEqual([ [ {} ] ]);
    expect(res.error.mock.calls).toEqual([
      [
        'internal_server_error',
        500,
        'Server_Error',
        500,
      ],
    ]);
    const { closeConnection } = await repositories();
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

});