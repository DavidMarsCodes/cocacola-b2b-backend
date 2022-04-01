module.exports = {
  resetCode: (error) => {
    const errorCodes = {
      UserNotFoundException: 2200,
      ExpiredCodeException: 2201,
      CodeMismatchException: 2202,
      InvalidPasswordException: 2203,
      InvalidParameterException: 2204,
      LimitExceededException: 2205,
      NotAuthorizedException: 2200,
    };

    error.code = errorCodes[error.name] || 2220;

    return error;
  },
};