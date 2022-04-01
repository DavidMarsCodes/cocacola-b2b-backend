const handler = require('../lambda');

describe('Lambda Function', () => {
  it('Should respond base64 string from S3', async () => {

    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 1,
      documentNumber: '1234',
      b2bSession: { Authorization: 'Bearer token' },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const awsS3 = { init: jest.fn().mockResolvedValue({ getObjectByKey: jest.fn().mockResolvedValue({ Body: { toString: jest.fn().mockReturnValue('dummy base64 pdf') } }) }) };

    const erp = {};

    const experts = { order: { hasInvoiceFile: jest.fn() } };

    const res = {
      success: jest.fn((data, status = 200) => ({
        data,
        httpStatus: status,
        ok: true,
        code: 0,
      })),
      error: jest.fn().mockResolvedValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };


    const { getOrderInvoice } = handler({ accessControl, awsS3, erp, experts, res });
    const response = await getOrderInvoice(event);


    expect(awsS3.init.mock.calls).toEqual([ [ 'CL' ] ]);

    const s3Manager = await awsS3.init();

    expect(s3Manager.getObjectByKey.mock.calls).toEqual([ [ '1234' ] ]);

    const s3Object = await s3Manager.getObjectByKey();

    expect(s3Object.Body.toString.mock.calls).toEqual([ [ 'base64' ] ]);

    expect(experts.order.hasInvoiceFile.mock.calls).toEqual([
      [
        { fileContent: 'dummy base64 pdf' },
      ],
    ]);

    expect(response).toEqual({
      data: { fileContent: 'dummy base64 pdf' },
      httpStatus: 200,
      ok: true,
      code: 0,
    });

  });

  it('Should respond base64 string from ERP', async () => {

    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 1,
      documentNumber: '1234',
      b2bSession: { Authorization: 'Bearer token' },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const awsS3 = { init: jest.fn().mockResolvedValue({ getObjectByKey: jest.fn().mockRejectedValue({ code: 'NoSuchKey' }) }) };

    const erp = { init: jest.fn().mockResolvedValue({ get: jest.fn().mockResolvedValue({ data: { fileContent: 'dummy base64 pdf' } }) }) };

    const experts = { order: { hasInvoiceFile: jest.fn() } };

    const res = {
      success: jest.fn((data, status = 200) => ({
        data,
        httpStatus: status,
        ok: true,
        code: 0,
      })),
      error: jest.fn().mockResolvedValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };


    const { getOrderInvoice } = handler({ accessControl, awsS3, erp, experts, res });
    const response = await getOrderInvoice(event);

    expect(awsS3.init.mock.calls).toEqual([ [ 'CL' ] ]);

    const s3Manager = await awsS3.init();

    expect(s3Manager.getObjectByKey.mock.calls).toEqual([ [ '1234' ] ]);

    expect(experts.order.hasInvoiceFile.mock.calls).toEqual([
      [
        { fileContent: 'dummy base64 pdf' },
      ],
    ]);

    expect(response).toEqual({
      data: { fileContent: 'dummy base64 pdf' },
      httpStatus: 200,
      ok: true,
      code: 0,
    });

  });

  it('Should respond unhandled error', async () => {

    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 1,
      documentNumber: '1234',
      b2bSession: { Authorization: 'Bearer token' },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const awsS3 = { init: jest.fn().mockResolvedValue({ getObjectByKey: jest.fn().mockRejectedValue({ code: 'InternalError' }) }) };

    const erp = { init: jest.fn().mockResolvedValue({ get: jest.fn().mockResolvedValue({ data: { fileContent: 'dummy base64 pdf' } }) }) };

    const experts = { order: { hasInvoiceFile: jest.fn() } };

    const res = {
      success: jest.fn((data, status = 200) => ({
        data,
        httpStatus: status,
        ok: true,
        code: 0,
      })),
      error: jest.fn().mockResolvedValue({
        httpStatus: 500,
        ok: false,
        code: 500,
        errorType: 'Server error',
        message: 'Internal Server Error',
      }),
    };


    const { getOrderInvoice } = handler({ accessControl, awsS3, erp, experts, res });
    const response = await getOrderInvoice(event);

    expect(awsS3.init.mock.calls).toEqual([ [ 'CL' ] ]);

    const s3Manager = await awsS3.init();

    expect(s3Manager.getObjectByKey.mock.calls).toEqual([ [ '1234' ] ]);

    expect(experts.order.hasInvoiceFile.mock.calls).toEqual([ ]);

    expect(response).toEqual({
      httpStatus: 500,
      ok: false,
      code: 500,
      errorType: 'Server error',
      message: 'Internal Server Error',
    });

  });


  it('Should respond validation error', async () => {

    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 1,
      documentNumber: '1234',
      b2bSession: { Authorization: 'Bearer token' },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const awsS3 = { init: jest.fn().mockResolvedValue({ getObjectByKey: jest.fn().mockRejectedValue({ code: 'NoSuchKey' }) }) };

    const erp = { init: jest.fn().mockResolvedValue({ get: jest.fn().mockResolvedValue({ data: { fileContent: '' } }) }) };

    const experts = {
      order: {
        hasInvoiceFile: jest.fn(() => {
          // eslint-disable-next-line no-throw-literal
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              httpStatus: 404,
              code: 42,
              type: 'Validation_error',
              msg: 'File not found',
            }),
          };
        }),
      },
    };

    const res = {
      success: jest.fn((data, status = 200) => ({
        data,
        httpStatus: status,
        ok: true,
        code: 0,
      })),
      error: jest.fn().mockResolvedValue({
        ok: false,
        httpStatus: 404,
        code: 42,
        errorType: 'Validation_error',
        message: 'File not found',
      }),
    };


    const { getOrderInvoice } = handler({ accessControl, awsS3, erp, experts, res });
    await getOrderInvoice(event);

    expect(awsS3.init.mock.calls).toEqual([ [ 'CL' ] ]);

    const s3Manager = await awsS3.init();

    expect(s3Manager.getObjectByKey.mock.calls).toEqual([ [ '1234' ] ]);

    expect(experts.order.hasInvoiceFile.mock.calls).toEqual([ [ { fileContent: '' } ] ]);

    expect(res.error.mock.calls).toEqual([
      [
        'File not found',
        42,
        'Validation_error',
        404,
      ],
    ]);

  });
});