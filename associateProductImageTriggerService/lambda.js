module.exports = ({ repositories, experts, bucket, strategy, res }) => ({

  associateProductImageTriggerService: async event => {
    let Product;
    let Discount;
    let closeConnection;

    try {
      ({ Product, Discount, closeConnection } = await repositories());

      const bucketName = bucket.get(event);

      const operation = strategy.selectOperation(bucketName);
      const model = strategy.selectModelForOperation(bucketName, Discount, Product);
      await operation.setImage(experts, model, event);

    } catch (e) {

      if (e.customError) {
        const err = e.getData();
        console.warn('Warning trying to update image: ', { type: err.type, message: err.msg, data: err.meta });
        console.warn('Event received: ', event);
        return res.error(err.msg, err.code, err.type, err.httpStatus);
      }

      console.error(e);
      const error = experts.product.handlersDatabaseError(e);
      const err = error.getData();
      return res.error(err.msg, err.code, err.type, err.httpStatus);
    } finally {
      await closeConnection();
    }
  },

});