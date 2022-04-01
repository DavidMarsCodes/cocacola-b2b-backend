const decrypt = (crypto, secretKey, params) => {
  const data = params;
  data.password = crypto.decrypt(secretKey.key, data.password);
  data.code = crypto.decrypt(secretKey.key, data.code);
  data.username = crypto.decrypt(secretKey.key, data.username);

  return data;
};

module.exports = { decrypt };