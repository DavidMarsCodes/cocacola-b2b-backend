# confirmOrderService
### informacion escrita en SQS para acutalizar creditos
- MsgGroupId:`confirmOrder.updateCredit-${event.cpgId}-${event.countryId}-${event.organizationId}-${event.orderId}-${event.clientId}`,
- MsgDeduplicationId: uuid
```
e.g. saved json:
{
    msgBody: {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 92,
      accumulatedBySegments: [
        { subTotal: 56256, segmentId: 1 },
        { subTotal: 13453, segmentId: 2 }
        ]
    },
    msgGroupId: 'confirmOrder.updateCredit-001-CL-3043-10000079-92',
    msgDedupId: '9247de15-292c-4385-947d-a8e184187bbc'
  }
}
```