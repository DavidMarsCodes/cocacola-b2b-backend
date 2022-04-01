module.exports = ({ repositories, experts, res }) => ({

  getProducts: async event => {
    let Product;
    let closeConnection;

    try {
      ({ Product, closeConnection } = await repositories());
      const { cpgId, countryId } = experts.product.validateProductGetAllRequiredParams(event);
      const { offset, limit } = experts.product.validateProductPaginationParams(event.offset, event.limit);

      const data = await Product.getAll(offset, limit, cpgId, countryId);
      experts.product.validateExistsResult(data);

      const pagination = {
        limit,
        offset,
        count: data.count,
        currentPage: data.currentPage,
      };

      return res.success(data.products, 200, pagination);

    } catch (e) {
      console.error(e);
      if (e.customError) {
        const error = e.getData();

        return res.error(error.msg, error.code, error.type, error.httpStatus);
      }
      return res.error('internal_server_error', 0, 'Server_Error', 500);
    } finally {
      await closeConnection();
    }
  },
});

