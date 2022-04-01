const { inspect } = require('util');

module.exports = (
  {
    accessControl,
    repositories,
    experts,
    res,
    dbRedis,
    taxType,
    strategy,
    builder,
    elasticSearchRepositories,
    Query,
    connection,
    elasticPortfolioPrice,
    awsRepositories,
    getTableNames,
    Cognito,
    getSourceChannel,
    rounding,
    taxesHandler,
    processOrderStrategy,
    elasticMapper,
    orderDeliveryStrategy,
  }) => ({

  createPartialOrder: async (event) => {

    const _createOrder = async () => {

      let Order;
      let Discount;
      let closeConnection;

      try {
        ({ Order, Discount, closeConnection } = await repositories());
        await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);
        const { userName, userPoolId: clientId, createdAndSigned, email } = await accessControl.getSessionData(event.b2bSession.Authorization);

        // Se setea de la propiedad createdBy con el email obtenido desde el token de usuario.
        event.createdBy = email;

        experts.order.isValidRequiredData(event);

        const redis = await dbRedis();
        const operationDates = await redis.operationDates.get(event, userName);
        experts.order.hasOperationDates(operationDates, {
          operationDates,
          message: `It not 'Operation Dates' were found for user: ${userName}`,
        });


        const priceDateByCountry = operationDates.pricesDate;
        const deliverydate = operationDates.deliverydate;
        const deliveryfrozen = operationDates.deliveryfrozen;


        const hasDataLoaded = await redis.clientDataLoaded.get(event);

        experts.order.hasDataLoaded(hasDataLoaded);

        const { DYNAMODB_TABLE_NAME, DYNAMODB_TABLE_NAME_PARAMETERS, DYNAMODB_TABLE_DISCOUNT_DOMAIN_MODEL } = await getTableNames();
        const { Repository } = awsRepositories;

        const rawDiscountData = await redis.clientDiscount.get(event);

        event.deliverydate = deliverydate;
        event.priceDateByCountry = priceDateByCountry;

        if (deliveryfrozen) {
          event.deliveryfrozen = deliveryfrozen;
        }


        const params = builder.buildRequireParams(event);
        const data = builder.buildKeyTable(event);

        const decimalPrecision = await Repository.get(DYNAMODB_TABLE_NAME_PARAMETERS, data);

        const cognito = new Cognito();
        const userPoolId = cognito.getUserPoolId(createdAndSigned);
        cognito.setIdentityConfig(clientId, userPoolId);

        const orderStrategy = strategy(event.orderId);

        // Create order header
        const { orderClient, exclusionsArray } = await orderStrategy.setOrder({
          event,
          experts,
          cognito,
          getSourceChannel,
          params,
          Order,
          Discount,
          redis,
        });

        let globalItems = [];

        const orderDataRedis = {
          cpgId: event.cpgId,
          countryId: event.countryId,
          organizationId: event.organizationId,
          clientId: event.clientId,
          orderId: orderClient.orderId,
          deliveryDates: [],
          items: [],
        };

        if (event.items.length > 0) {

          // Map incomming data from Elastic Search to custom JSON.
          await elasticMapper(event, elasticPortfolioPrice, params, connection, elasticSearchRepositories, Query);

          if (!deliveryfrozen) {
            event.items = event.items.filter((x) => x.deliveryType !== 'deliveryfrozen');
          }


          console.info('BEFORE', inspect(event, false, null, true));
          event.items = await processOrderStrategy(event, rawDiscountData, exclusionsArray, priceDateByCountry, DYNAMODB_TABLE_DISCOUNT_DOMAIN_MODEL);
          console.info('AFTER', inspect(event, false, null, true));

          const taxes = await Order.getTaxesData(event.clientId, event.priceDateByCountry);

          // acumulo precio neto total del pedido para cálculo de percepciones.
          const totalNetPrice = event.items.reduce((acumPrice, currentItem) => {
            acumPrice += currentItem.price.listPrice - currentItem.price.discounts;
            return acumPrice;
          }, 0);

          globalItems = await taxesHandler.taxCalculator(event, taxType, taxes, totalNetPrice);
          rounding.order.applyRounds(globalItems, decimalPrecision.Item.params.ROUND_PRESICION);

          // Create order delivery items
          const { deliveries } = await orderDeliveryStrategy(event, orderClient);
          console.debug('orderDelivery:', deliveries);

          // Upsert order delivery data
          orderDataRedis.deliveryDates = deliveries;
          orderDataRedis.items = globalItems;

        }
        await redis.order.upsert(event, orderClient.orderId, orderDataRedis);
        redis.closeConnection();

        await Repository.create(DYNAMODB_TABLE_NAME, {
          orderId: orderClient.orderId.toString(),
          calculatedItems: globalItems,
        });
        return res.status(201).json({
          orderId: orderClient.orderId,
          calculatedItems: globalItems,
        });

      } catch (e) {
        console.error(inspect(e, false, null, true));
        if (e.customError) {
          const error = e.getData();
          return res.error(error.msg, error.code, error.type, error.httpStatus);
        }
        const err = experts.order.handlersDatabaseError(e);
        const error = err.getData();
        return res.error(error.msg, error.code, error.type, error.httpStatus, error.meta);
      } finally {
        closeConnection();
      }
    };
    return _createOrder();
  },
});