module.exports = ({ awsRepositories, repositories, getTableName, experts, res }) => ({
  upsertBasePrice: async event => {

    let PriceListItem, PriceList, Product, Client, closeConnection;

    try {
      const dynamoTransactionId = event.Records[0].dynamodb.NewImage.transactionId.S;
      const { tableName, tableNameError } = await getTableName();
      const { Repository } = awsRepositories;

      ({ PriceListItem, PriceList, Product, Client, closeConnection } = await repositories());

      const dynamoData = await Repository.get(tableName, { transactionId: dynamoTransactionId });

      const erpParams = {
        cpgId: dynamoData.Item.cpgId,
        countryId: dynamoData.Item.countryId,
        organizationId: dynamoData.Item.organizationId,
      };

      const statusArray = [];

      for (const item of dynamoData.Item.data) {

        let existingClient;
        let existingPriceList;
        if (item.erpPriceListId) {
          existingPriceList = await PriceList.getOrCreateByErpId(item.erpPriceListId, erpParams);

          const parsedPriceListId = Number(existingPriceList.priceListId);
          existingClient = await Client.getByErpIdOrPriceListId(parsedPriceListId);
        } else

          existingClient = await Client.getByErpIdOrPriceListId(item.erpClientId);



        for (const product of item.products)
          try {

            // Verificamos que exista el producto.
            const existingProduct = await Product.getByErpId(product.erpProductId, erpParams);

            // Validamos que exista el product (experto). En caso de no existir lanzamos excepcion.
            experts.product.validateExistsResult(existingProduct);

            // Creamos el objeto para almacenar en la tabla shippingPriceListItem.
            const PriceProductData = {
              ...product,
              ...erpParams,
              productId: existingProduct.productId,
              clientId: existingClient.clientId,
              priceListId: existingPriceList ? existingPriceList.priceListId : existingClient.priceListId,
            };

            // Creamos o actualizamos un registro en la tabla shippingPriceListItem.
            await PriceListItem.upsert(existingProduct.productId, PriceProductData);

          } catch (e) {
            // ----> push al array para guardar en tabla de errores
            const failedProductObject = {};

            failedProductObject.erpPriceListId = item.erpPriceListId;
            failedProductObject.erpProductId = product.erpProductId;
            failedProductObject.message = e.msg ? e.msg : 'ERROR';

            statusArray.push(failedProductObject);

          }

      }

      const createdTime = new Date().toISOString();

      if (statusArray.length !== 0) Repository.create(tableNameError, { transactionId: dynamoTransactionId, statusArray, createdTime });

    } catch (e) {
      console.error(e);
      if (!e.customError)
        return res.error('internal_server_error', 0, 'server_error', 500);

      const err = e.getData();
      return res.error(err.msg, err.code, err.type, err.httpStatus);
    } finally {
      await closeConnection();
    }
  },
});