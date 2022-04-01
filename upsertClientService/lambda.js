module.exports = ({ awsRepositories, repositories, getTableName, experts, res }) => ({
  upsertClient: async event => {

    let Client, Lock, ClientLock, PriceList, ShippingPriceList, InvoiceDeadlinePlan, closeConnection;

    try {
      // Obtenemos el TransactionId del event trigger
      const dynamoTransactionId = event.Records[0].dynamodb.NewImage.transactionId.S;

      // Creamos las insatancias de los repositorios requeridos.
      const { Repository } = awsRepositories;
      ({ Client, Lock, ClientLock, PriceList, ShippingPriceList, InvoiceDeadlinePlan, closeConnection } = await repositories());
      const { tableName, tableNameError } = await getTableName();

      // Traer los datos almacenados de clientes que queremos actualizar.
      const dynamoData = await Repository.get(tableName, { transactionId: dynamoTransactionId });

      // Validar datos requeridos.
      experts.client.validateUpsertClient(dynamoData.Item);

      // Armamos objeto con los parametros necesarios para crear registros en tabla.
      const erpParams = {
        cpgId: dynamoData.Item.cpgId,
        countryId: dynamoData.Item.countryId,
        organizationId: dynamoData.Item.organizationId,
      };

      // Creamos un array donde vamos a almacenar los estados de los resultados de las operaciones.
      const statusArray = [];
      let clientData = {};

      // Recorremos las listas de clients de cada ERP.
      for (const item of dynamoData.Item.data)

        try {

          clientData = {
            ...erpParams,
            ...item,
            ...item.address,
          };

          // Validar datos requeridos dentro de items.
          experts.client.validateUpsertItemClient(clientData);

          // Validar si existe un erpPriceListId y si este es valido.
          if (item.erpPriceListId) {
            const existingPriceList = await PriceList.getByErpId(item.erpPriceListId, erpParams);
            experts.priceList.validateExistsResult(existingPriceList, { erpPriceListId: item.erpPriceListId, erpParams });
            clientData.priceListId = existingPriceList.priceListId;
          }

          // Validar si existe un erpShippingPriceListId y si este es valido.
          if (item.erpShippingPriceListId) {
            const existingShippingPriceList = await ShippingPriceList.getByErpId(item.erpShippingPriceListId, erpParams);
            experts.shippingPriceList.validateExistsResult(existingShippingPriceList, { erpShippingPriceListId: item.erpShippingPriceListId, erpParams });
            clientData.shippingPriceListId = existingShippingPriceList.shippingPriceListId;
          }

          const existingInvoiceDeadlinePlan = await InvoiceDeadlinePlan.getByErpId(item.erpInvoiceDeadlinePlanId, erpParams);
          experts.invoicePlan.validateExistsResult(existingInvoiceDeadlinePlan, { erpInvoiceDeadlinePlanId: item.erpInvoiceDeadlinePlanId, erpParams });
          clientData.invoiceDeadlinePlanId = existingInvoiceDeadlinePlan.invoiceDeadlinePlanId;

          const clientResult = await Client.upsert(clientData);

          // se construyen los parametros de busqueda para comenzar a borrar los bloqueos de clientes
          const erpParamsToDelete = {
            ...erpParams,
            clientId: clientResult.clientId,
          };

          // Buscar los bloqueos de clientes
          const hasClientLocks = await ClientLock.getAllByClientId(erpParamsToDelete);

          // Se comienza con el borrado de bloqueos del cliente si existen bloqueos
          if (hasClientLocks.length > 0)
            await ClientLock.deleteByClientId(erpParamsToDelete);


          if (item.locks && item.locks.length > 0)
            for (const lockItem of item.locks) {

              // Buscar bloqueo por erpLockId y obtener el lockId.
              const lock = await Lock.getByErpId(lockItem, erpParams);

              // Crear bloqueo en la tabla clientLock con el lockId obtenido.
              const newClientLock = {
                ...erpParams,
                clientId: clientResult.clientId,
                lockId: lock.lockId,
              };

              await ClientLock.createClientLock(newClientLock);
            }


          const failedObject = { ...item };

          failedObject.operationStatus = 'Ok';

          statusArray.push(failedObject);
          const createdTime = new Date().toISOString();

          await Repository.create(tableNameError, { transactionId: dynamoTransactionId, statusArray, createdTime });


        } catch (e) {
          console.error(e);
          const failedObject = { ...item };

          failedObject.message = e.msg ? e.msg : 'ERROR';
          failedObject.operationStatus = 'Failed';

          statusArray.push(failedObject);
          const createdTime = new Date().toISOString();

          await Repository.create(tableNameError, { transactionId: dynamoTransactionId, statusArray, createdTime });
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
