
const setDiscountImage = require('../../services/strategies/setDiscountImage');

describe('SetProductImage method', () => {

  it('You should set an image of a product.', async () => {

    const experts = {
      discount: {
        getParamsDiscountImage: jest.fn().mockReturnValue({
          cpg: '001',
          countryId: 'AR',
          organizationId: '3043',
          erpDiscountId: '001AR3043-CC-NR-3.0-PET',
        }),
        validationRequiredParamsDiscountImage: jest.fn(),
        getDiscountImageUrl: jest.fn().mockReturnValue('001_AR_3043_001AR3043-CC-NR-3.0-PET'),
        validateExistsResult: jest.fn(),
      },
    };
    const Discount = { updateImage: jest.fn().mockResolvedValue({}) };

    const event = {
      Records: [
        {
          s3: {
            s3SchemaVersion: '1.0',
            configurationId: 'testConfigRule',
            bucket: {
              name: 'sourcebucket',
              ownerIdentity: { principalId: 'A3NL1KOZZKExample' },
              arn: 'arn:aws:s3:::b2b-discount-images-dev/001_AR_3043_001AR3043-CC-NR-3.0-PET.png',
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

    await setDiscountImage.set(experts, Discount, event);

    expect(experts.discount.getParamsDiscountImage.mock.calls).toEqual([
      [
        event,
      ],
    ]);

    expect(experts.discount.validationRequiredParamsDiscountImage.mock.calls).toEqual([
      [
        {
          cpg: '001',
          countryId: 'AR',
          organizationId: '3043',
          erpDiscountId: '001AR3043-CC-NR-3.0-PET',
        },
      ],
    ]);

    expect(Discount.updateImage.mock.calls).toEqual([
      [
        {
          cpg: '001',
          countryId: 'AR',
          organizationId: '3043',
          erpDiscountId: '001AR3043-CC-NR-3.0-PET',
        },
        '001_AR_3043_001AR3043-CC-NR-3.0-PET',
      ],
    ]);

    expect(experts.discount.validateExistsResult.mock.calls).toEqual([
      [
        {},
        'DISCOUNT_IMAGE_NOT_UPDATE',
        {
          countryId: 'AR',
          cpg: '001',
          erpDiscountId: '001AR3043-CC-NR-3.0-PET',
          image: '001_AR_3043_001AR3043-CC-NR-3.0-PET',
          organizationId: '3043',
        },
      ],
    ]);
  });

});