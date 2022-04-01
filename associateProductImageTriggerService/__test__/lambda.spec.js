const handler = require('../lambda');

describe('AssociateProductImageTriggerService Lambda Function.', () => {
  it('You should set the url of the image in the image property of a product or discount.', async () => {
    const event = {
      Records: [
        {
          s3: {
            s3SchemaVersion: '1.0',
            configurationId: 'testConfigRule',
            bucket: {
              name: 'sourcebucket',
              ownerIdentity: { principalId: 'A3NL1KOZZKExample' },
              arn: 'arn:aws:s3:::b2b-product-images-dev/001_AR_3043_001AR3043-CC-NR-3.0-PET.png',
            },
            object: {
              key: '001_AR_3043_001AR3043-CC-NR-3.0-PET.png',
              size: 1024,
              eTag: 'd41d8cd98f00b204e9800998ecf8427e',
              versionId: '096fKKXTRTtl3on89fVO.nfljtsv6qko',
            },
          },
        },
      ],
    };

    const repositories = jest.fn().mockResolvedValue({
      Product: { updateImage: jest.fn().mockResolvedValue(true) },
      Discount: { updateImage: jest.fn().mockResolvedValue(true) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      product: {
        getParamsProductImage: jest.fn().mockReturnValue({
          cpg: '001',
          countryId: 'AR',
          organizationId: '3043',
          productId: '001AR3043-CC-NR-3.0-PET',
        }),
        validationRequiredParamsProductImage: jest.fn(),
        getProductImageUrl: jest.fn().mockReturnValue('001_AR_3043_001AR3043-CC-NR-3.0-PET.png'),
        validateExistsResult: jest.fn(),
      },
      discount: {
        getParamsProductImage: jest.fn().mockReturnValue({
          cpg: '001',
          countryId: 'AR',
          organizationId: '3043',
          productId: '001AR3043-CC-NR-3.0-PET',
        }),
        validationRequiredParamsProductImage: jest.fn(),
        getProductImageUrl: jest.fn().mockReturnValue('001_AR_3043_001AR3043-CC-NR-3.0-PET.png'),
        validateExistsResult: jest.fn(),
      },
    };

    const bucket = { get: jest.fn().mockReturnValue('products') };
    const strategy = {
      selectOperation: jest.fn().mockReturnValue({ setImage: jest.fn().mockResolvedValue({}) }),
      selectModelForOperation: jest.fn().mockReturnValue({}),
    };

    const res = { error: jest.fn() };

    const { associateProductImageTriggerService } = handler({ repositories, experts, bucket, strategy, res });

    await associateProductImageTriggerService(event);

    expect(repositories.mock.calls).toEqual([ [] ]);


    expect(strategy.selectOperation.mock.calls).toEqual([
      [
        'products',
      ],
    ]);

    const { Product, Discount, closeConnection } = await repositories();
    expect(strategy.selectModelForOperation.mock.calls).toEqual([
      [
        'products',
        Discount,
        Product,
      ],
    ]);

    expect(strategy.selectOperation().setImage.mock.calls).toEqual([
      [
        experts,
        {},
        event,
      ],
    ]);

    expect(res.error.mock.calls).toEqual([]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return a handled error of type product_error in case of failure of validation.', async () => {

    const event = {
      Records: [
        {
          s3: {
            s3SchemaVersion: '1.0',
            configurationId: 'testConfigRule',
            bucket: {
              name: 'sourcebucket',
              ownerIdentity: { principalId: 'A3NL1KOZZKExample' },
              arn: 'arn:aws:s3:::b2b-product-images-dev/001_AR_3043_001AR3043-CC-NR-3.0-PET.png',
            },
            object: {
              key: '001_AR_3043_001AR3043-CC-NR-3.0-PET.png',
              size: 1024,
              eTag: 'd41d8cd98f00b204e9800998ecf8427e',
              versionId: '096fKKXTRTtl3on89fVO.nfljtsv6qko',
            },
          },
        },
      ],
    };

    const repositories = jest.fn().mockResolvedValue({
      Product: { updateImage: jest.fn().mockResolvedValue(true) },
      Discount: { updateImage: jest.fn().mockResolvedValue(true) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      product: {
        getParamsProductImage: jest.fn().mockReturnValue({
          cpg: '001',
          countryId: 'AR',
          organizationId: '3043',
          productId: '001AR3043-CC-NR-3.0-PET',
        }),
        validationRequiredParamsProductImage: jest.fn(),
        getProductImageUrl: jest.fn().mockReturnValue('001_AR_3043_001AR3043-CC-NR-3.0-PET.png'),
        validateExistsResult: jest.fn(),
      },
      discount: {
        getParamsProductImage: jest.fn().mockReturnValue({
          cpg: '001',
          countryId: 'AR',
          organizationId: '3043',
          productId: '001AR3043-CC-NR-3.0-PET',
        }),
        validationRequiredParamsProductImage: jest.fn(),
        getProductImageUrl: jest.fn().mockReturnValue('001_AR_3043_001AR3043-CC-NR-3.0-PET.png'),
        validateExistsResult: jest.fn(),
      },
    };

    const bucket = { get: jest.fn().mockReturnValue('products') };
    const strategy = {
      selectOperation: jest.fn().mockReturnValue({
        setImage: jest.fn().mockRejectedValue({
          customError: true,
          getData: jest.fn().mockReturnValue({
            msg: 'product_not_found',
            code: 30,
            type: 'product_error',
            httpStatus: 400,
          }),
        }),
      }),
      selectModelForOperation: jest.fn().mockReturnValue({}),
    };

    const res = { error: jest.fn() };

    const { associateProductImageTriggerService } = handler({ repositories, experts, bucket, strategy, res });

    await associateProductImageTriggerService(event);

    expect(repositories.mock.calls).toEqual([ [] ]);


    expect(strategy.selectOperation.mock.calls).toEqual([
      [
        'products',
      ],
    ]);

    const { Product, Discount, closeConnection } = await repositories();
    expect(strategy.selectModelForOperation.mock.calls).toEqual([
      [
        'products',
        Discount,
        Product,
      ],
    ]);

    expect(strategy.selectOperation().setImage.mock.calls).toEqual([
      [
        experts,
        {},
        event,
      ],
    ]);

    expect(res.error.mock.calls).toEqual([
      [
        'product_not_found',
        30,
        'product_error',
        400,
      ],
    ]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });

  it('It should return a handled error of type sequalizer error in case the query to the database fails.', async () => {

    const event = {
      Records: [
        {
          s3: {
            s3SchemaVersion: '1.0',
            configurationId: 'testConfigRule',
            bucket: {
              name: 'sourcebucket',
              ownerIdentity: { principalId: 'A3NL1KOZZKExample' },
              arn: 'arn:aws:s3:::b2b-product-images-dev/001_AR_3043_001AR3043-CC-NR-3.0-PET.png',
            },
            object: {
              key: '001_AR_3043_001AR3043-CC-NR-3.0-PET.png',
              size: 1024,
              eTag: 'd41d8cd98f00b204e9800998ecf8427e',
              versionId: '096fKKXTRTtl3on89fVO.nfljtsv6qko',
            },
          },
        },
      ],
    };

    const repositories = jest.fn().mockResolvedValue({
      Product: { updateImage: jest.fn().mockResolvedValue(true) },
      Discount: { updateImage: jest.fn().mockResolvedValue(true) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      product: {
        getParamsProductImage: jest.fn().mockReturnValue({
          cpg: '001',
          countryId: 'AR',
          organizationId: '3043',
          productId: '001AR3043-CC-NR-3.0-PET',
        }),
        validationRequiredParamsProductImage: jest.fn(),
        getProductImageUrl: jest.fn().mockReturnValue('001_AR_3043_001AR3043-CC-NR-3.0-PET.png'),
        validateExistsResult: jest.fn(),
        handlersDatabaseError: jest.fn().mockReturnValue({
          customError: true,
          getData: jest.fn().mockReturnValue({
            httpStatus: 500,
            status: 'error',
            code: 100,
            msg: 'error',
            type: 'sequalizer_error',
          }),
        }),
      },
      discount: {
        getParamsProductImage: jest.fn().mockReturnValue({
          cpg: '001',
          countryId: 'AR',
          organizationId: '3043',
          productId: '001AR3043-CC-NR-3.0-PET',
        }),
        validationRequiredParamsProductImage: jest.fn(),
        getProductImageUrl: jest.fn().mockReturnValue('001_AR_3043_001AR3043-CC-NR-3.0-PET.png'),
        validateExistsResult: jest.fn(),
        handlersDatabaseError: jest.fn().mockReturnValue({
          customError: true,
          getData: jest.fn().mockReturnValue({
            httpStatus: 500,
            status: 'error',
            code: 100,
            msg: 'error',
            type: 'sequalizer_error',
          }),
        }),
      },
    };

    const bucket = { get: jest.fn().mockReturnValue('products') };

    const strategy = {
      selectOperation: jest.fn().mockReturnValue({ setImage: jest.fn().mockRejectedValue({}) }),
      selectModelForOperation: jest.fn().mockReturnValue({}),
    };

    const res = { error: jest.fn() };

    const { associateProductImageTriggerService } = handler({ repositories, experts, bucket, strategy, res });

    await associateProductImageTriggerService(event);

    expect(repositories.mock.calls).toEqual([ [] ]);

    expect(strategy.selectOperation.mock.calls).toEqual([
      [
        'products',
      ],
    ]);

    const { Product, Discount, closeConnection } = await repositories();
    expect(strategy.selectModelForOperation.mock.calls).toEqual([
      [
        'products',
        Discount,
        Product,
      ],
    ]);

    expect(strategy.selectOperation().setImage.mock.calls).toEqual([
      [
        experts,
        {},
        event,
      ],
    ]);

    expect(res.error.mock.calls).toEqual([
      [
        'error',
        100,
        'sequalizer_error',
        500,
      ],
    ]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });

});