const basePriceMock = {
  Item: {
    transactionId: '123456',
    cpgTransactionId: 'UUID',
    countryId: 'AR',
    cpgId: '001',
    organizationId: '3043',
    data: [
      {
        erpPriceListId: '111111',
        products: [
          {
            validity_from: '25-11-2020',
            validity_to: '26-12-2020',
            erpProductId: 'test123',
            basePrice: 10,
            taxes: 1,
          },
          {
            validity_from: '25-11-2020',
            validity_to: '26-12-2020',
            erpProductId: 'test456',
            basePrice: 20,
            taxes: 2,
          },
        ],
      },
      {
        erpPriceListId: '222222',
        products: [
          {
            validity_from: '25-11-2020',
            validity_to: '26-12-2020',
            erpProductId: 'test123',
            basePrice: 10,
            taxes: 1,
          },
          {
            validity_from: '25-11-2020',
            validity_to: '26-12-2020',
            erpProductId: 'test456',
            basePrice: 20,
            taxes: 2,
          },
        ],
      },
    ],
  },
};

const eventMock = {
  Records: [
    {
      eventID: '033f9c60dd5da9fea97922d4d06dc50e',
      eventName: 'INSERT',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'us-east-1',
      dynamodb:
                {
                  ApproximateCreationDateTime: 1609856134,
                  Keys: { transactionId: { S: '16fefcc2-28e3-11eb-adc1-0242ac120002' } },
                  NewImage: {
                    organizationId: { S: '3043' },
                    cpgId: { S: '001' },
                    data: { L: [ { M: {} } ] },
                    countryId: { S: 'AR' },
                    transactionId: { S: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
                  },
                  SequenceNumber: '4136500000000007589800824',
                  SizeBytes: 372,
                  StreamViewType: 'NEW_IMAGE',
                },
      eventSourceARN: 'arn:aws:dynamodb:us-east-1:583081784313:table/devOrderHistoryToUpsert/stream/2021-01-05T14:05:45.609',
    },
  ],
};

module.exports = {
  basePriceMock,
  eventMock,
};