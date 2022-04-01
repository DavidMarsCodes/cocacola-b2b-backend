module.exports = ({ awsRepositories, repositories, getTableName, experts, res }) => ({
  upsertShippingPrice: async event => {

    let ShippingPriceListItem, ShippingPriceList, Client, Product, closeConnection;
    try {
      // Se utiliza la primer posición de Records porque se genera un transactionId por envío de SAP.
      // Se utiliza "transactionId.S" ya que DynamoDB agrega al objeto el tipo de dato. En este caso un String.
      const dynamoTransactionId = event.Records[0].dynamodb.NewImage.transactionId.S;
      // Creamos las insatancias de los repositorios requeridos.
      const { Repository } = awsRepositories;
      ({ ShippingPriceListItem, ShippingPriceList, Client, Product, closeConnection } = await repositories());

      const { tableName, tableNameError } = await getTableName();

      // Traer los datos almacenados de precio felte de los productos que queremos actualizar.
      const dynamoData = await Repository.get(tableName, { transactionId: dynamoTransactionId });

      // Armamos objeto con los parametros necesarios para crear registros en tabla.
      const erpParams = {
        cpgId: dynamoData.Item.cpgId,
        countryId: dynamoData.Item.countryId,
        organizationId: dynamoData.Item.organizationId,
      };

      // Creamos un array donde vamos a almacenar los estados de los resultados de las operaciones.
      const statusArray = [];

      // Recorremos las listas de precio flete de cada ERP.
      for (const item of dynamoData.Item.data) {

        let existingClient;
        let existingShippingPriceList;
        if (item.erpShippingPriceListId) {
          /*
                    CASO DE USO 1: Validar si existe una Lista de precio flete para el ERP enviado. Si no existe debemos crearla.
                    */
          // Verificamos que exista el shippingPriceList. Si existe traemos los datos, si no existe la creamos con el id de erpShippingPriceList.
          existingShippingPriceList = await ShippingPriceList.getOrCreateByErpId(item.erpShippingPriceListId, erpParams);

          // Verificamos que exista el cliente a traves de un erpClientId o un shippingPriceListId.
          const parsedShippingPriceListId = Number(existingShippingPriceList.shippingPriceListId);
          existingClient = await Client.getByErpIdOrShippingPriceListId(parsedShippingPriceListId);

        } else
        /*
                    CASO DE USO 2: Necesita golpear a Cliente para buscar shippingPriceListId
                    */
          existingClient = await Client.getByErpIdOrShippingPriceListId(item.erpClientId);


        // Recorremos los productos de una lista de precio flete.
        for (const product of item.products)
          try {
            // Verificamos que exista el producto.
            const existingProduct = await Product.getByErpId(product.erpProductId, erpParams);

            // Validamos que exista el product (experto). En caso de no existir lanzamos excepcion.
            experts.product.validateExistsResult(existingProduct);

            // Creamos el objeto para almacenar en la tabla shippingPriceListItem.
            const shippingPriceProductData = {
              ...product,
              ...erpParams,
              productId: existingProduct.productId,
              clientId: existingClient.clientId,
              shippingPriceListId: existingShippingPriceList ? existingShippingPriceList.shippingPriceListId : existingClient.shippingPriceListId,
            };

            // Creamos o actualizamos un registro en la tabla shippingPriceListItem.
            await ShippingPriceListItem.upsert(existingProduct.productId, shippingPriceProductData);

          } catch (e) {
            // Push al array para guardar en tabla de errores
            console.log(e);
            const failedProductObject = {};

            if (item.erpClientId) failedProductObject.erpClientId = item.erpClientId;

            if (item.erpShippingPriceListId) failedProductObject.erpShippingPriceListId = item.erpShippingPriceListId;

            failedProductObject.erpShippingPriceListId = item.erpShippingPriceListId;
            failedProductObject.erpProductId = product.erpProductId;
            failedProductObject.message = e.msg ? e.msg : 'ERROR';
            failedProductObject.operationStatus = 'Failed';

            statusArray.push(failedProductObject);
            const createdTime = new Date().toISOString();

            await Repository.create(tableNameError, { transactionId: dynamoTransactionId, statusArray, createdTime });
          }

      }

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
