const decrypt = (crypto, secretKey, params) => {
  const data = { ...params };
  data.oldPassword = crypto.decrypt(secretKey.key, data.oldPassword);
  data.newPassword = crypto.decrypt(secretKey.key, data.newPassword);

  return data;
};

module.exports = { decrypt };
