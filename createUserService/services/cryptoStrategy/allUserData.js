class EncryptionAllUserData {
    encryptor;

    constructor(encryptor) {
      this.encryptor = encryptor;
    }

    encrypt (value, key) {
      return this.encryptor.encrypt(value, key);
    }

    decrypt (value, key) {
      return this.encryptor.decrypt(value, key);
    }

    encryptAll (params, secretKey) {
      const userData = { ...params };
      return this.encryptor.encryptAll(userData, secretKey);
    }

    decryptAll (params, secretKey) {
      const userData = { ...params };
      const encryptedData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        cellphone: userData.cellphone,
        password: userData.password,
        fieldSelectedToLogin: userData.fieldSelectedToLogin,
        client: {
          fiscalId: userData.client.fiscalId,
          erpClientId: userData.client.erpClientId,
        },
      };
      return this.encryptor.decryptAll(encryptedData, secretKey);
    }
}

module.exports = EncryptionAllUserData;