const handler = require('../lambda');

describe('updateProductImageBatchService Lambda Function.', () => {
  it('You should set the url of the image in the image property of a product.', async () => {
    const event = {};

    const repositories = jest.fn().mockResolvedValue({
      Discount: {
        getAllNotImage: jest.fn().mockResolvedValue([
          {
            name: 'Coca Cola Personal 350cc x 24',
            discountId: '001CL3043000000000000120141',
            cpgId: '001',
            countryId: 'CL',
            organizationId: '3043',
          },
        ]),
        updateAllImages: jest.fn().mockResolvedValue(true),
      },
      closeConnection: jest.fn().mockResolvedValue({}),

    });

    const experts = {
      discount: {
        buildImageName: jest.fn().mockReturnValue([ {
          name: 'Coca Cola Personal 350cc x 24',
          discountId: '001CL3043000000000000120141',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          imageName: '001_CL_3043_001CL3043000000000000120141',
        } ]),
        validateLastImage: jest.fn().mockReturnValue({
          name: 'Coca Cola Personal 350cc x 24',
          discountId: '001CL3043000000000000120141',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          imageName: '001_CL_3043_001CL3043000000000000120141',
        }),
        buildImageUrl: jest.fn().mockReturnValue('image+product+test/001_CL_3043_001CL3043000000000000120141.png'),
        setImageData: jest.fn().mockReturnValue({
          name: 'Coca Cola Personal 350cc x 24',
          discountId: '001CL3043000000000000120141',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          imageName: '001_CL_3043_001CL3043000000000000120141',
          image: 'image+product+test/001_CL_3043_001CL3043000000000000120141.png',
        }),
        filter: jest.fn().mockReturnValue([
          {
            name: 'Coca Cola Personal 350cc x 24',
            discountId: '001CL3043000000000000120141',
            cpgId: '001',
            countryId: 'CL',
            organizationId: '3043',
            imageName: '001_CL_3043_001CL3043000000000000120141',
            image: 'image+product+test/001_CL_3043_001CL3043000000000000120141.png',
          },
        ]),
        handlersDatabaseError: jest.fn(),
      },
    };

    const awsS3 = { init: jest.fn().mockResolvedValue({ getAllImages: jest.fn().mockResolvedValue(true) }) };

    const res = { error: jest.fn() };

    const { updateDiscountImageBatchService } = handler({ repositories, experts, awsS3, res });

    await updateDiscountImageBatchService(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(awsS3.init.mock.calls).toEqual([ [] ]);

    const { Discount, closeConnection } = await repositories();
    expect(Discount.getAllNotImage.mock.calls).toEqual([ [] ]);

    expect(experts.discount.buildImageName.mock.calls).toEqual([
      [
        [
          {
            name: 'Coca Cola Personal 350cc x 24',
            discountId: '001CL3043000000000000120141',
            cpgId: '001',
            countryId: 'CL',
            organizationId: '3043',
          },
        ],
      ],
    ]);

    const { getAllImages } = await awsS3.init();
    expect(getAllImages.mock.calls).toEqual([
      [
        '001_CL_3043_001CL3043000000000000120141',
      ],
    ]);

    expect(experts.discount.validateLastImage.mock.calls).toEqual([
      [
        true,
      ],
    ]);
    expect(experts.discount.buildImageUrl.mock.calls).toEqual([
      [
        {
          name: 'Coca Cola Personal 350cc x 24',
          discountId: '001CL3043000000000000120141',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          imageName: '001_CL_3043_001CL3043000000000000120141',
        },
      ],
    ]);

    expect(experts.discount.setImageData.mock.calls).toEqual([
      [
        {
          name: 'Coca Cola Personal 350cc x 24',
          discountId: '001CL3043000000000000120141',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          imageName: '001_CL_3043_001CL3043000000000000120141',
        },
        'image+product+test/001_CL_3043_001CL3043000000000000120141.png',
      ],
    ]);

    expect(experts.discount.filter.mock.calls).toEqual([
      [
        [
          {
            name: 'Coca Cola Personal 350cc x 24',
            discountId: '001CL3043000000000000120141',
            cpgId: '001',
            countryId: 'CL',
            organizationId: '3043',
            imageName: '001_CL_3043_001CL3043000000000000120141',
            image: 'image+product+test/001_CL_3043_001CL3043000000000000120141.png',
          },
        ],
      ],
    ]);

    expect(Discount.updateAllImages.mock.calls).toEqual([
      [
        [
          {
            name: 'Coca Cola Personal 350cc x 24',
            discountId: '001CL3043000000000000120141',
            cpgId: '001',
            countryId: 'CL',
            organizationId: '3043',
            imageName: '001_CL_3043_001CL3043000000000000120141',
            image: 'image+product+test/001_CL_3043_001CL3043000000000000120141.png',
          },
        ],
      ],
    ]);

    expect(res.error.mock.calls).toEqual([]);

    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });

});