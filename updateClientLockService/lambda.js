module.exports = ({ repositories, experts, res }) => ({

  postClientLock: async event => {
    const { ClientLock, closeConnection } = await repositories();
    try {

      experts.clientLock.validateCreateClientLockData(event);

      const data = await ClientLock.create(event);

      experts.clientLock.validateExistsResult(data);

      return res.status(201).json(data);

    } catch (e) {
      console.error(e);
      if (e.customError) {
        const error = e.getData();
        return res.error(error.msg, error.code, error.type, error.httpStatus);
      }
      const err = experts.clientLock.handlersDatabaseError(e);
      const error = err.getData();
      return res.error(error.msg, error.code, error.type, error.httpStatus, error.meta);
    } finally {
      await closeConnection();
    }

  },
});