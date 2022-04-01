class EncryptionPasswordOnly {
    encryptor;

    constructor(encryptor) {
      this.encryptor = encryptor;
    }

    encrypt (value, key) {
      this.encryptor.encrypt(value, key);
    }

    decrypt (value, key) {
      this.encryptor.decrypt(value, key);
    }

    encryptAll (params, secretKey) {
      const data = { password: params.password };
      return this.encryptor.encryptAll(data, secretKey);
    }

    decryptAll (params, secretKey) {
      const encryptedData = { password: params.password };
      return this.encryptor.decryptAll(encryptedData, secretKey);
    }
}

module.exports = EncryptionPasswordOnly;