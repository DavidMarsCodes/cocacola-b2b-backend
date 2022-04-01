module.exports = ({ accessControl, awsS3, erp, experts, res }) => ({

  getOrderInvoice: async (event) => {
    try {
      console.debug(event);

      await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);

      let base64Pdf;
      const s3Manager = await awsS3.init(event.countryId);
      try {
        // buscamos el PDF desde el S3
        const s3PDF = await s3Manager.getObjectByKey(event.documentNumber);
        base64Pdf = { fileContent: s3PDF.Body.toString('base64') };
      } catch (error) {
        if (!error.code || error.code !== 'NoSuchKey') {
          throw error;
        }
        // si no encontramos el PDF en el S3 lo pedimos a ERP
        const erpManager = await erp.init(event);
        const erpResponse = await erpManager.get();
        base64Pdf = erpResponse.data;
      }

      experts.order.hasInvoiceFile(base64Pdf);

      return res.success(base64Pdf, 200);

    } catch (error) {
      console.error(error);
      if (error.customError) {
        const err = error.getData();
        return res.error(err.msg, err.code, err.type, err.httpStatus);
      }
      return res.error('Internal Server Error', 500, 'Server Error', 500, JSON.stringify(error));
    }
  },

});