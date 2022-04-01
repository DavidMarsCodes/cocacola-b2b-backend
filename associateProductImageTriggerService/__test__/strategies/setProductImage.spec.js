
const setProductImage = require('../../services/strategies/setProductImage');

describe('SetProductImage method', () => {

  it('You should set an image of a product.', async () => {

    const experts = {
      product: {
        getParamsProductImage: jest.fn().mockReturnValue({
          cpg: '001',
          countryId: 'AR',
          organizationId: '3043',
          erpProductId: '001AR3043-CC-NR-3.0-PET',
        }),
        validationRequiredParamsProductImage: jest.fn(),
        getProductImageUrl: jest.fn().mockReturnValue('001_AR_3043_001AR3043-CC-NR-3.0-PET'),
        validateExistsResult: jest.fn(),
      },
    };
    const Product = { updateImage: jest.fn().mockResolvedValue({}) };

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

    await setProductImage.set(experts, Product, event);

    expect(experts.product.getParamsProductImage.mock.calls).toEqual([
      [
        event,
      ],
    ]);

    expect(experts.product.validationRequiredParamsProductImage.mock.calls).toEqual([
      [
        {
          cpg: '001',
          countryId: 'AR',
          organizationId: '3043',
          erpProductId: '001AR3043-CC-NR-3.0-PET',
        },
      ],
    ]);

    expect(Product.updateImage.mock.calls).toEqual([
      [
        {
          cpg: '001',
          countryId: 'AR',
          organizationId: '3043',
          erpProductId: '001AR3043-CC-NR-3.0-PET',
        },
        '001_AR_3043_001AR3043-CC-NR-3.0-PET',
      ],
    ]);

    expect(experts.product.validateExistsResult.mock.calls).toEqual([
      [
        {},
        'PRODUCT_IMAGE_NOT_UPDATE',
        {
          countryId: 'AR',
          cpg: '001',
          erpProductId: '001AR3043-CC-NR-3.0-PET',
          image: '001_AR_3043_001AR3043-CC-NR-3.0-PET',
          organizationId: '3043',
        },
      ],
    ]);
  });

});