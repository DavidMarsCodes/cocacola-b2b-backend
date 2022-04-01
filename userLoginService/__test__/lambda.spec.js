const handler = require('../lambda');

describe('Lambda Function', () => {
  it('It should log in with the user and return the tokens', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      email: 'test@gmail.com',
      password: 'Password@123',
      erpClientId: '0500000001',
    };

    const repositories = jest.fn().mockResolvedValue({
      User: { getUserByEmailOrPhoneAndTenant: jest.fn().mockResolvedValue({ username: 'pepito', countryId: 'CL' }) },
      Client: { getClientIdByErpId: jest.fn().mockResolvedValue({ clientId: 1 }) },
      closeConnection: jest.fn(),
    });

    const experts = {
      user: {
        validateUserLogin: jest.fn(),
        validateLoginFoundUser: jest.fn(),
      },
      client: { validateExistsResult: jest.fn() },
    };

    const handlerErrorCode = { resetCode: jest.fn() };

    const getEncryption = jest.fn().mockReturnValue({ decrypt: jest.fn().mockReturnValue('Password@123') });

    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn().mockReturnValue({}) }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const awsConfig = {
      getSecretEncryptionKey: jest.fn().mockResolvedValue({ key: 'eee' }),
      getCognitoInfo: jest.fn().mockResolvedValue({
        USER_POOL_ID: 'USER_POOL_ID_test',
        CLIENT_ID: 'CLIENT_ID_test',
        DYNAMODB_TABLE_NAME: 'devExternalUserSession',
      }),
    };

    const adminGetUser = jest.fn().mockResolvedValue({
      Username: 'ca710a4e-0f7c-4845-ad6c-29dc07063bab',
      UserAttributes: [
        {
          Name: 'sub',
          Value: 'ca710a4e-0f7c-4845-ad6c-29dc07063bab',
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
        {
          Name: 'phone_number_verified',
          Value: 'false',
        },
        {
          Name: 'phone_number',
          Value: '+561111111111',
        },
        {
          Name: 'email',
          Value: 'test@gmail.com',
        },
      ],
      UserCreateDate: '2021-10-13T15:46:44.089Z',
      UserLastModifiedDate: '2021-10-13T15:46:58.367Z',
      Enabled: true,
      UserStatus: 'CONFIRMED',
    });

    const adminInitiateAuth = jest.fn().mockResolvedValue({
      ChallengeParameters: {},
      AuthenticationResult: {
        AccessToken: 'eyJraWQiOiJGNVA1TUxvVkhCb2w3R2srYUlpdnhMTGVSYWF1amtZaWJkeW02WlhURGxjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjYTcxMGE0ZS0wZjdjLTQ4NDUtYWQ2Yy0yOWRjMDcwNjNiYWIiLCJjb2duaXRvOmdyb3VwcyI6WyJpbnZva2UtYXBpIl0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1d6bzR2OGV3NSIsImNsaWVudF9pZCI6ImNia3RiaWgxOW02ZHNycGM3aGhjaW1uaCIsIm9yaWdpbl9qdGkiOiI2Zjc3YTEyYS04ZTI4LTQ4YTgtYjA0ZC1lMDdiNWUzN2QxN2IiLCJldmVudF9pZCI6IjFlYjI5M2NkLWZkZjAtNDYxYi05YjgzLTBlNTQyYjQxMWYxZiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2MzgzMDU4ODAsImV4cCI6MTYzODMwOTQ4MCwiaWF0IjoxNjM4MzA1ODgwLCJqdGkiOiIxNzZmNDE3My1iNGU4LTQ1OTUtYWZlNC03YjkzMWUxMWNjNDkiLCJ1c2VybmFtZSI6ImNhNzEwYTRlLTBmN2MtNDg0NS1hZDZjLTI5ZGMwNzA2M2JhYiJ9.Y68CNG5d_yaRUTBrJ5O0Sn8Lwnhq85X3UwHYElQ7p0SqLTE55lJ3mVVZICnbqvKwXYWjbbOBBBHy-lVlck_a4lWYyccIWtrSe7HJa6YPuwVVA-k60WAWJ-sHDlS4cW8eephyg2d62yRfierGTSFT8vH64KEniEtaANGDOEMoQebTr7m-HGdKKHgubFwgP9u4EewDYfjz0IX39aaf_27eM8sD5foofwAmQ_HvbyObyRj45el24G5W84Iiil04A1FuZcmKxobz2PIgWwhA15PkmIwKFdSN0WnZmcpTsAoW9ecla6Y2BBoNjtdZNlZCX_RkuhH5j_pHBdlopq_om4ruQw',
        ExpiresIn: 3600,
        TokenType: 'Bearer',
        RefreshToken: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.zTtA-IMsgX0bZPe3W3Ot2kp4IYz2C6ZjMtSCx8vL7goIwlG_abwIF2JfJUkdW3vIsjnzfFKAsUAKptk0LkYgxxPivT3657JdqrUH1d_znvYN47WG3T_668PEpTXYzeW2wKWfYZBm37cK9ZzRBbqgoe-yX0L2N6r0I8cMVlKrudN50VCtKbXCHVuMeSce1PsPETRPbhDr-ibXuvyxND8zpfW1fCCsd-d7acxe1ksKgPmUvkngat6xBalqbUHtI8q0VASypqY79-YxyRg6aGrwO2i49XNF_0aTinmo8GJTbsG15B7gSymSoz5qeOQPsNwAlMtEKH_c6iMQkc2zQyUclw.BTOLP3rxPy6V12wK.NpjfNKzH5IpAyPoAP_1sQwvDavLehm-eu_x_YSg7DzGLJu7nHk0S1L7PIZuQuDebjf_Y9sP4R908hXO6HwwoojbpBVPWAMflOyCSfAdx3T0n4BZEANSU3f02XWTT8Yvta2MfBBVsDAj6j8qq-6aHWRxpkKCMLYHXnJZPuLn6PVPb2AmIBRAfn3MWDTD8Kpx4SjO4Zi7MyGN6Pbpm0A3-b08p3pvkvNQbOIMKnJ2l4kTxndsk_tYvB7hkGxLDOF6Ue80pwPKAiwvupaIIHmGT1eRNIEU30qfRc_RQ4MgNqybIeieQx58BPFwmYUCUkrNdsi1IISvGzDCZ_aP2puEbyHQ9mBLZ5MUNDmW4d-KCdCAP_MdZ7ZAciCnguS2oNcv6gyxX_RYZNzj3kprk_295lHAJUM11RaVSLKmwDB6xpjzCS9gY7unyMeoPYH-_lEwZRFIz532Q3xoO3k1YP_q5-CXoMDLeVZVBRiFe4P9ZIr7quibYLbdbQehoXtO6Tvj19UT7OwOmNJ6BT1YaT-Ift3zIVpbGbPWOsdHkA8wg4rbAtO3IZuDsuIkUtW1TPhQfw8crsf9yZfoB2nbGwJG_3FWaapsxT9yc4zc6HumaSWkrv9Yue-EwOQnPyF_s69B0Drib_J9MzA5557E2Dp3XRryv0C5WM9Ya5JDKBG1AoUexo1NTTIvaDGr9RbF-PNAGUFs-ljE7d1SYszleBjXpV-emWYDD_KNIL2veG_kw0Ij0DGgrh9pWQp1nTq6HcBKDcjO3izEDcucP2cxjsl749lyRs40zUH7oVGfbV6JvYaD6kFPyr0kxJhFnpeCFAQMi672PCDUWi9bjvRoT0OK5oLQ3d8013HUti5f6BJCw2cZ7aRLcOE6mjmrMXF0BDoTbqpIeiASXWaxpWVbVu3bqnLIhgoKueo53DTrr5qIAJa6g7vujKd4WvyfrL2syN8AqzjTT6W4fo2760L0W_tqiTYuVojPWhxUrus9b1Wcl7dZMypiGgKKEP92H1cuqzht-OLmPjO0uHI6SAPo1UGIgqdDqdh3tx0ALLCDjb1e93PJtJTOhLkfjQfqHgiG_pK3E3YYxnCJS_Sr4wH8gsbj7ZrR5dlUhX8Li_W3rcOgCNR9BXSmBa9BY8LYJl1JgZ2E7JjNn4odRnNnloGpemFQTKEbcNRY5T5LFgb4CUMAMLozh-YfykliH0-_DnIst2s1BgmL65TgzWUcBIPxrEj5IcJ-rG9c3oPkF8AZFZZGuXh6aG1-viIT6vQZynje9Cmq0VHHqugJWaDolCzzdG2oJdVoUIWfriLrQ-7yxrU73iS7v9Ed0UN5O-Fzh.D0ItofbYCmFkoh_8UO-yhg',
        IdToken: 'eyJraWQiOiJZejk3Q05TSGl1RitOWVJkeTJOUVNZbTFmb0d2dXJZenJCNGxucDJZQ1BJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjYTcxMGE0ZS0wZjdjLTQ4NDUtYWQ2Yy0yOWRjMDcwNjNiYWIiLCJjb2duaXRvOmdyb3VwcyI6WyJpbnZva2UtYXBpIl0sImNvZ25pdG86cHJlZmVycmVkX3JvbGUiOiJhcm46YXdzOmlhbTo6NTgzMDgxNzg0MzEzOnJvbGVcL2lhbV9yX2NvZ25pdG9fc2VjdXJlX2ludm9rZS1hcGkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9Xem80djhldzUiLCJjb2duaXRvOnVzZXJuYW1lIjoiY2E3MTBhNGUtMGY3Yy00ODQ1LWFkNmMtMjlkYzA3MDYzYmFiIiwib3JpZ2luX2p0aSI6IjZmNzdhMTJhLThlMjgtNDhhOC1iMDRkLWUwN2I1ZTM3ZDE3YiIsImNvZ25pdG86cm9sZXMiOlsiYXJuOmF3czppYW06OjU4MzA4MTc4NDMxMzpyb2xlXC9pYW1fcl9jb2duaXRvX3NlY3VyZV9pbnZva2UtYXBpIl0sImF1ZCI6ImNia3RiaWgxOW02ZHNycGM3aGhjaW1uaCIsImV2ZW50X2lkIjoiMWViMjkzY2QtZmRmMC00NjFiLTliODMtMGU1NDJiNDExZjFmIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MzgzMDU4ODAsInBob25lX251bWJlciI6Iis1NjExMTExMTExMTEiLCJleHAiOjE2MzgzMDk0ODAsImlhdCI6MTYzODMwNTg4MCwianRpIjoiNTE5MGEyMDktNWQ4Yy00NzQzLTk2MGEtNzBmZjkxYjJlZDc0IiwiZW1haWwiOiJhbGV4aXMucG9yY2VsQGluY2x1aXQuY29tIn0.VxMHyPCLTu0XxfrUll1WLqgrDZPz6z4wpuwBmtvOMY-XQSHwffW7QpXiHvfq-oAWgVXOtWWOq7AvsuibHipsEMc55BZy3ZX-bGfGvAFRkPAv9JZOcCjCqgZRbfCjTXqE-F-3mGyKnbCGfeStebBbwwRgFCs5OQ2zIug6708iPwhaYZ7-vmoaRpEpg0ftaIebM4zTIySfnbURs2cpNGkQjMJJZwHuouSHVHM9bXB8-IfC29qL7evll2yOLo4IgnyNRmbUbaB2JH1DyMAdltDgb5nJ4kSBNUuZTLlw0-whoE_3F_i1adNHTTredDnDTceUR4NODq27VBEmm8eP4cTH8Q',
      },
    });

    const Cognito = jest.fn().mockImplementation(() => ({
      adminGetUser,
      adminInitiateAuth,
    }));

    const uuid = { v4: jest.fn().mockReturnValue('4e6272f6-737c-4f99-8439-1d2f080bbe62') };

    const awsRepositories = {
      Repository: {
        create: jest.fn().mockResolvedValue({
          TableName: 'devExternalUserSession',
          Item: {
            id: '4e6272f6-737c-4f99-8439-1d2f080bbe62',
            AccessToken: 'eyJraWQiOiJGNVA1TUxvVkhCb2w3R2srYUlpdnhMTGVSYWF1amtZaWJkeW02WlhURGxjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjYTcxMGE0ZS0wZjdjLTQ4NDUtYWQ2Yy0yOWRjMDcwNjNiYWIiLCJjb2duaXRvOmdyb3VwcyI6WyJpbnZva2UtYXBpIl0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1d6bzR2OGV3NSIsImNsaWVudF9pZCI6ImNia3RiaWgxOW02ZHNycGM3aGhjaW1uaCIsIm9yaWdpbl9qdGkiOiI2Zjc3YTEyYS04ZTI4LTQ4YTgtYjA0ZC1lMDdiNWUzN2QxN2IiLCJldmVudF9pZCI6IjFlYjI5M2NkLWZkZjAtNDYxYi05YjgzLTBlNTQyYjQxMWYxZiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2MzgzMDU4ODAsImV4cCI6MTYzODMwOTQ4MCwiaWF0IjoxNjM4MzA1ODgwLCJqdGkiOiIxNzZmNDE3My1iNGU4LTQ1OTUtYWZlNC03YjkzMWUxMWNjNDkiLCJ1c2VybmFtZSI6ImNhNzEwYTRlLTBmN2MtNDg0NS1hZDZjLTI5ZGMwNzA2M2JhYiJ9.Y68CNG5d_yaRUTBrJ5O0Sn8Lwnhq85X3UwHYElQ7p0SqLTE55lJ3mVVZICnbqvKwXYWjbbOBBBHy-lVlck_a4lWYyccIWtrSe7HJa6YPuwVVA-k60WAWJ-sHDlS4cW8eephyg2d62yRfierGTSFT8vH64KEniEtaANGDOEMoQebTr7m-HGdKKHgubFwgP9u4EewDYfjz0IX39aaf_27eM8sD5foofwAmQ_HvbyObyRj45el24G5W84Iiil04A1FuZcmKxobz2PIgWwhA15PkmIwKFdSN0WnZmcpTsAoW9ecla6Y2BBoNjtdZNlZCX_RkuhH5j_pHBdlopq_om4ruQw',
            ExpiresIn: 3600,
            TokenType: 'Bearer',
            RefreshToken: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.zTtA-IMsgX0bZPe3W3Ot2kp4IYz2C6ZjMtSCx8vL7goIwlG_abwIF2JfJUkdW3vIsjnzfFKAsUAKptk0LkYgxxPivT3657JdqrUH1d_znvYN47WG3T_668PEpTXYzeW2wKWfYZBm37cK9ZzRBbqgoe-yX0L2N6r0I8cMVlKrudN50VCtKbXCHVuMeSce1PsPETRPbhDr-ibXuvyxND8zpfW1fCCsd-d7acxe1ksKgPmUvkngat6xBalqbUHtI8q0VASypqY79-YxyRg6aGrwO2i49XNF_0aTinmo8GJTbsG15B7gSymSoz5qeOQPsNwAlMtEKH_c6iMQkc2zQyUclw.BTOLP3rxPy6V12wK.NpjfNKzH5IpAyPoAP_1sQwvDavLehm-eu_x_YSg7DzGLJu7nHk0S1L7PIZuQuDebjf_Y9sP4R908hXO6HwwoojbpBVPWAMflOyCSfAdx3T0n4BZEANSU3f02XWTT8Yvta2MfBBVsDAj6j8qq-6aHWRxpkKCMLYHXnJZPuLn6PVPb2AmIBRAfn3MWDTD8Kpx4SjO4Zi7MyGN6Pbpm0A3-b08p3pvkvNQbOIMKnJ2l4kTxndsk_tYvB7hkGxLDOF6Ue80pwPKAiwvupaIIHmGT1eRNIEU30qfRc_RQ4MgNqybIeieQx58BPFwmYUCUkrNdsi1IISvGzDCZ_aP2puEbyHQ9mBLZ5MUNDmW4d-KCdCAP_MdZ7ZAciCnguS2oNcv6gyxX_RYZNzj3kprk_295lHAJUM11RaVSLKmwDB6xpjzCS9gY7unyMeoPYH-_lEwZRFIz532Q3xoO3k1YP_q5-CXoMDLeVZVBRiFe4P9ZIr7quibYLbdbQehoXtO6Tvj19UT7OwOmNJ6BT1YaT-Ift3zIVpbGbPWOsdHkA8wg4rbAtO3IZuDsuIkUtW1TPhQfw8crsf9yZfoB2nbGwJG_3FWaapsxT9yc4zc6HumaSWkrv9Yue-EwOQnPyF_s69B0Drib_J9MzA5557E2Dp3XRryv0C5WM9Ya5JDKBG1AoUexo1NTTIvaDGr9RbF-PNAGUFs-ljE7d1SYszleBjXpV-emWYDD_KNIL2veG_kw0Ij0DGgrh9pWQp1nTq6HcBKDcjO3izEDcucP2cxjsl749lyRs40zUH7oVGfbV6JvYaD6kFPyr0kxJhFnpeCFAQMi672PCDUWi9bjvRoT0OK5oLQ3d8013HUti5f6BJCw2cZ7aRLcOE6mjmrMXF0BDoTbqpIeiASXWaxpWVbVu3bqnLIhgoKueo53DTrr5qIAJa6g7vujKd4WvyfrL2syN8AqzjTT6W4fo2760L0W_tqiTYuVojPWhxUrus9b1Wcl7dZMypiGgKKEP92H1cuqzht-OLmPjO0uHI6SAPo1UGIgqdDqdh3tx0ALLCDjb1e93PJtJTOhLkfjQfqHgiG_pK3E3YYxnCJS_Sr4wH8gsbj7ZrR5dlUhX8Li_W3rcOgCNR9BXSmBa9BY8LYJl1JgZ2E7JjNn4odRnNnloGpemFQTKEbcNRY5T5LFgb4CUMAMLozh-YfykliH0-_DnIst2s1BgmL65TgzWUcBIPxrEj5IcJ-rG9c3oPkF8AZFZZGuXh6aG1-viIT6vQZynje9Cmq0VHHqugJWaDolCzzdG2oJdVoUIWfriLrQ-7yxrU73iS7v9Ed0UN5O-Fzh.D0ItofbYCmFkoh_8UO-yhg',
            IdToken: 'eyJraWQiOiJZejk3Q05TSGl1RitOWVJkeTJOUVNZbTFmb0d2dXJZenJCNGxucDJZQ1BJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjYTcxMGE0ZS0wZjdjLTQ4NDUtYWQ2Yy0yOWRjMDcwNjNiYWIiLCJjb2duaXRvOmdyb3VwcyI6WyJpbnZva2UtYXBpIl0sImNvZ25pdG86cHJlZmVycmVkX3JvbGUiOiJhcm46YXdzOmlhbTo6NTgzMDgxNzg0MzEzOnJvbGVcL2lhbV9yX2NvZ25pdG9fc2VjdXJlX2ludm9rZS1hcGkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9Xem80djhldzUiLCJjb2duaXRvOnVzZXJuYW1lIjoiY2E3MTBhNGUtMGY3Yy00ODQ1LWFkNmMtMjlkYzA3MDYzYmFiIiwib3JpZ2luX2p0aSI6IjZmNzdhMTJhLThlMjgtNDhhOC1iMDRkLWUwN2I1ZTM3ZDE3YiIsImNvZ25pdG86cm9sZXMiOlsiYXJuOmF3czppYW06OjU4MzA4MTc4NDMxMzpyb2xlXC9pYW1fcl9jb2duaXRvX3NlY3VyZV9pbnZva2UtYXBpIl0sImF1ZCI6ImNia3RiaWgxOW02ZHNycGM3aGhjaW1uaCIsImV2ZW50X2lkIjoiMWViMjkzY2QtZmRmMC00NjFiLTliODMtMGU1NDJiNDExZjFmIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MzgzMDU4ODAsInBob25lX251bWJlciI6Iis1NjExMTExMTExMTEiLCJleHAiOjE2MzgzMDk0ODAsImlhdCI6MTYzODMwNTg4MCwianRpIjoiNTE5MGEyMDktNWQ4Yy00NzQzLTk2MGEtNzBmZjkxYjJlZDc0IiwiZW1haWwiOiJhbGV4aXMucG9yY2VsQGluY2x1aXQuY29tIn0.VxMHyPCLTu0XxfrUll1WLqgrDZPz6z4wpuwBmtvOMY-XQSHwffW7QpXiHvfq-oAWgVXOtWWOq7AvsuibHipsEMc55BZy3ZX-bGfGvAFRkPAv9JZOcCjCqgZRbfCjTXqE-F-3mGyKnbCGfeStebBbwwRgFCs5OQ2zIug6708iPwhaYZ7-vmoaRpEpg0ftaIebM4zTIySfnbURs2cpNGkQjMJJZwHuouSHVHM9bXB8-IfC29qL7evll2yOLo4IgnyNRmbUbaB2JH1DyMAdltDgb5nJ4kSBNUuZTLlw0-whoE_3F_i1adNHTTredDnDTceUR4NODq27VBEmm8eP4cTH8Q',
            username: 'pepito',
            clientId: 1,
          },
        }),
      },
    };

    const { userLoginService } = handler({
      repositories,
      experts,
      res,
      awsConfig,
      getEncryption,
      handlerErrorCode,
      Cognito,
      awsRepositories,
      uuid,
    });

    await userLoginService(event);

    expect(experts.user.validateUserLogin.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          email: 'test@gmail.com',
          password: 'Password@123',
          erpClientId: '0500000001',
        },
      ],
    ]);
    expect(awsConfig.getSecretEncryptionKey.mock.calls).toEqual([ [] ]);
    expect(getEncryption().decrypt.mock.calls).toEqual([
      [
        'Password@123',
        'eee',
      ],
    ]);
    expect(adminGetUser.mock.calls).toEqual([
      [
        {
          Username: 'test@gmail.com',
          UserPoolId: 'USER_POOL_ID_test',
        },
      ],
    ]);
    expect(adminInitiateAuth.mock.calls).toEqual([
      [

        {
          UserPoolId: 'USER_POOL_ID_test',
          ClientId: 'CLIENT_ID_test',
          AuthParameters:
                    {
                      USERNAME: 'ca710a4e-0f7c-4845-ad6c-29dc07063bab',
                      PASSWORD: 'Password@123',
                    },
        },

      ],
    ]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([
      [
        'devExternalUserSession',
        {
          id: '4e6272f6-737c-4f99-8439-1d2f080bbe62',
          AccessToken: 'eyJraWQiOiJGNVA1TUxvVkhCb2w3R2srYUlpdnhMTGVSYWF1amtZaWJkeW02WlhURGxjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjYTcxMGE0ZS0wZjdjLTQ4NDUtYWQ2Yy0yOWRjMDcwNjNiYWIiLCJjb2duaXRvOmdyb3VwcyI6WyJpbnZva2UtYXBpIl0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1d6bzR2OGV3NSIsImNsaWVudF9pZCI6ImNia3RiaWgxOW02ZHNycGM3aGhjaW1uaCIsIm9yaWdpbl9qdGkiOiI2Zjc3YTEyYS04ZTI4LTQ4YTgtYjA0ZC1lMDdiNWUzN2QxN2IiLCJldmVudF9pZCI6IjFlYjI5M2NkLWZkZjAtNDYxYi05YjgzLTBlNTQyYjQxMWYxZiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2MzgzMDU4ODAsImV4cCI6MTYzODMwOTQ4MCwiaWF0IjoxNjM4MzA1ODgwLCJqdGkiOiIxNzZmNDE3My1iNGU4LTQ1OTUtYWZlNC03YjkzMWUxMWNjNDkiLCJ1c2VybmFtZSI6ImNhNzEwYTRlLTBmN2MtNDg0NS1hZDZjLTI5ZGMwNzA2M2JhYiJ9.Y68CNG5d_yaRUTBrJ5O0Sn8Lwnhq85X3UwHYElQ7p0SqLTE55lJ3mVVZICnbqvKwXYWjbbOBBBHy-lVlck_a4lWYyccIWtrSe7HJa6YPuwVVA-k60WAWJ-sHDlS4cW8eephyg2d62yRfierGTSFT8vH64KEniEtaANGDOEMoQebTr7m-HGdKKHgubFwgP9u4EewDYfjz0IX39aaf_27eM8sD5foofwAmQ_HvbyObyRj45el24G5W84Iiil04A1FuZcmKxobz2PIgWwhA15PkmIwKFdSN0WnZmcpTsAoW9ecla6Y2BBoNjtdZNlZCX_RkuhH5j_pHBdlopq_om4ruQw',
          ExpiresIn: 3600,
          TokenType: 'Bearer',
          RefreshToken: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.zTtA-IMsgX0bZPe3W3Ot2kp4IYz2C6ZjMtSCx8vL7goIwlG_abwIF2JfJUkdW3vIsjnzfFKAsUAKptk0LkYgxxPivT3657JdqrUH1d_znvYN47WG3T_668PEpTXYzeW2wKWfYZBm37cK9ZzRBbqgoe-yX0L2N6r0I8cMVlKrudN50VCtKbXCHVuMeSce1PsPETRPbhDr-ibXuvyxND8zpfW1fCCsd-d7acxe1ksKgPmUvkngat6xBalqbUHtI8q0VASypqY79-YxyRg6aGrwO2i49XNF_0aTinmo8GJTbsG15B7gSymSoz5qeOQPsNwAlMtEKH_c6iMQkc2zQyUclw.BTOLP3rxPy6V12wK.NpjfNKzH5IpAyPoAP_1sQwvDavLehm-eu_x_YSg7DzGLJu7nHk0S1L7PIZuQuDebjf_Y9sP4R908hXO6HwwoojbpBVPWAMflOyCSfAdx3T0n4BZEANSU3f02XWTT8Yvta2MfBBVsDAj6j8qq-6aHWRxpkKCMLYHXnJZPuLn6PVPb2AmIBRAfn3MWDTD8Kpx4SjO4Zi7MyGN6Pbpm0A3-b08p3pvkvNQbOIMKnJ2l4kTxndsk_tYvB7hkGxLDOF6Ue80pwPKAiwvupaIIHmGT1eRNIEU30qfRc_RQ4MgNqybIeieQx58BPFwmYUCUkrNdsi1IISvGzDCZ_aP2puEbyHQ9mBLZ5MUNDmW4d-KCdCAP_MdZ7ZAciCnguS2oNcv6gyxX_RYZNzj3kprk_295lHAJUM11RaVSLKmwDB6xpjzCS9gY7unyMeoPYH-_lEwZRFIz532Q3xoO3k1YP_q5-CXoMDLeVZVBRiFe4P9ZIr7quibYLbdbQehoXtO6Tvj19UT7OwOmNJ6BT1YaT-Ift3zIVpbGbPWOsdHkA8wg4rbAtO3IZuDsuIkUtW1TPhQfw8crsf9yZfoB2nbGwJG_3FWaapsxT9yc4zc6HumaSWkrv9Yue-EwOQnPyF_s69B0Drib_J9MzA5557E2Dp3XRryv0C5WM9Ya5JDKBG1AoUexo1NTTIvaDGr9RbF-PNAGUFs-ljE7d1SYszleBjXpV-emWYDD_KNIL2veG_kw0Ij0DGgrh9pWQp1nTq6HcBKDcjO3izEDcucP2cxjsl749lyRs40zUH7oVGfbV6JvYaD6kFPyr0kxJhFnpeCFAQMi672PCDUWi9bjvRoT0OK5oLQ3d8013HUti5f6BJCw2cZ7aRLcOE6mjmrMXF0BDoTbqpIeiASXWaxpWVbVu3bqnLIhgoKueo53DTrr5qIAJa6g7vujKd4WvyfrL2syN8AqzjTT6W4fo2760L0W_tqiTYuVojPWhxUrus9b1Wcl7dZMypiGgKKEP92H1cuqzht-OLmPjO0uHI6SAPo1UGIgqdDqdh3tx0ALLCDjb1e93PJtJTOhLkfjQfqHgiG_pK3E3YYxnCJS_Sr4wH8gsbj7ZrR5dlUhX8Li_W3rcOgCNR9BXSmBa9BY8LYJl1JgZ2E7JjNn4odRnNnloGpemFQTKEbcNRY5T5LFgb4CUMAMLozh-YfykliH0-_DnIst2s1BgmL65TgzWUcBIPxrEj5IcJ-rG9c3oPkF8AZFZZGuXh6aG1-viIT6vQZynje9Cmq0VHHqugJWaDolCzzdG2oJdVoUIWfriLrQ-7yxrU73iS7v9Ed0UN5O-Fzh.D0ItofbYCmFkoh_8UO-yhg',
          IdToken: 'eyJraWQiOiJZejk3Q05TSGl1RitOWVJkeTJOUVNZbTFmb0d2dXJZenJCNGxucDJZQ1BJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjYTcxMGE0ZS0wZjdjLTQ4NDUtYWQ2Yy0yOWRjMDcwNjNiYWIiLCJjb2duaXRvOmdyb3VwcyI6WyJpbnZva2UtYXBpIl0sImNvZ25pdG86cHJlZmVycmVkX3JvbGUiOiJhcm46YXdzOmlhbTo6NTgzMDgxNzg0MzEzOnJvbGVcL2lhbV9yX2NvZ25pdG9fc2VjdXJlX2ludm9rZS1hcGkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9Xem80djhldzUiLCJjb2duaXRvOnVzZXJuYW1lIjoiY2E3MTBhNGUtMGY3Yy00ODQ1LWFkNmMtMjlkYzA3MDYzYmFiIiwib3JpZ2luX2p0aSI6IjZmNzdhMTJhLThlMjgtNDhhOC1iMDRkLWUwN2I1ZTM3ZDE3YiIsImNvZ25pdG86cm9sZXMiOlsiYXJuOmF3czppYW06OjU4MzA4MTc4NDMxMzpyb2xlXC9pYW1fcl9jb2duaXRvX3NlY3VyZV9pbnZva2UtYXBpIl0sImF1ZCI6ImNia3RiaWgxOW02ZHNycGM3aGhjaW1uaCIsImV2ZW50X2lkIjoiMWViMjkzY2QtZmRmMC00NjFiLTliODMtMGU1NDJiNDExZjFmIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MzgzMDU4ODAsInBob25lX251bWJlciI6Iis1NjExMTExMTExMTEiLCJleHAiOjE2MzgzMDk0ODAsImlhdCI6MTYzODMwNTg4MCwianRpIjoiNTE5MGEyMDktNWQ4Yy00NzQzLTk2MGEtNzBmZjkxYjJlZDc0IiwiZW1haWwiOiJhbGV4aXMucG9yY2VsQGluY2x1aXQuY29tIn0.VxMHyPCLTu0XxfrUll1WLqgrDZPz6z4wpuwBmtvOMY-XQSHwffW7QpXiHvfq-oAWgVXOtWWOq7AvsuibHipsEMc55BZy3ZX-bGfGvAFRkPAv9JZOcCjCqgZRbfCjTXqE-F-3mGyKnbCGfeStebBbwwRgFCs5OQ2zIug6708iPwhaYZ7-vmoaRpEpg0ftaIebM4zTIySfnbURs2cpNGkQjMJJZwHuouSHVHM9bXB8-IfC29qL7evll2yOLo4IgnyNRmbUbaB2JH1DyMAdltDgb5nJ4kSBNUuZTLlw0-whoE_3F_i1adNHTTredDnDTceUR4NODq27VBEmm8eP4cTH8Q',
          username: 'pepito',
          clientId: 1,
          countryId: 'CL',
        },
      ],
    ]);
    expect(res.status.mock.calls).toEqual([
      [ 200 ],
    ]);
    expect(res.status().json.mock.calls).toEqual([
      [

        { id: '4e6272f6-737c-4f99-8439-1d2f080bbe62' },

      ],
    ]);
  });

  it('It should return a handled error in case of failure to validate the required parameters.', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      email: 'test@gmail.com',
      password: 'Password@123',
      erpClientId: '0500000001',
    };

    const repositories = jest.fn().mockResolvedValue({
      User: { getUserByEmailOrPhoneAndTenant: jest.fn().mockResolvedValue({ username: 'pepito' }) },
      Client: { getClientIdByErpId: jest.fn().mockResolvedValue({ clientId: 1 }) },
      closeConnection: jest.fn(),
    });

    const experts = {
      user: {
        validateUserLogin: jest.fn(() => {
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              httpStatus: 400,
              status: 'error',
              code: 100,
              msg: 'Validation_server_error',
              type: 'Validation_error',
            }),
          };
        }),
        validateLoginFoundUser: jest.fn(),
      },
    };

    const handlerErrorCode = {
      resetCode: jest.fn().mockReturnValue({
        httpStatus: 400,
        status: 'error',
        code: 2000,
        msg: 'Validation_server_error',
        type: 'Validation_error',
      }),
    };

    const getEncryption = jest.fn().mockReturnValue({ decrypt: jest.fn().mockReturnValue('Password@123') });

    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn().mockReturnValue({}) }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const awsConfig = {
      getSecretEncryptionKey: jest.fn().mockResolvedValue({ key: 'eee' }),
      getCognitoInfo: jest.fn().mockResolvedValue({
        USER_POOL_ID: 'USER_POOL_ID_test',
        CLIENT_ID: 'CLIENT_ID_test',
      }),
    };

    const adminGetUser = jest.fn().mockResolvedValue({
      Username: 'ca710a4e-0f7c-4845-ad6c-29dc07063bab',
      UserAttributes: [
        {
          Name: 'sub',
          Value: 'ca710a4e-0f7c-4845-ad6c-29dc07063bab',
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
        {
          Name: 'phone_number_verified',
          Value: 'false',
        },
        {
          Name: 'phone_number',
          Value: '+561111111111',
        },
        {
          Name: 'email',
          Value: 'test@gmail.com',
        },
      ],
      UserCreateDate: '2021-10-13T15:46:44.089Z',
      UserLastModifiedDate: '2021-10-13T15:46:58.367Z',
      Enabled: true,
      UserStatus: 'CONFIRMED',
    });

    const adminInitiateAuth = jest.fn().mockResolvedValue({
      ChallengeParameters: {},
      AuthenticationResult: {
        AccessToken: 'eyJraWQiOiJGNVA1TUxvVkhCb2w3R2srYUlpdnhMTGVSYWF1amtZaWJkeW02WlhURGxjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjYTcxMGE0ZS0wZjdjLTQ4NDUtYWQ2Yy0yOWRjMDcwNjNiYWIiLCJjb2duaXRvOmdyb3VwcyI6WyJpbnZva2UtYXBpIl0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1d6bzR2OGV3NSIsImNsaWVudF9pZCI6ImNia3RiaWgxOW02ZHNycGM3aGhjaW1uaCIsIm9yaWdpbl9qdGkiOiI2Zjc3YTEyYS04ZTI4LTQ4YTgtYjA0ZC1lMDdiNWUzN2QxN2IiLCJldmVudF9pZCI6IjFlYjI5M2NkLWZkZjAtNDYxYi05YjgzLTBlNTQyYjQxMWYxZiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2MzgzMDU4ODAsImV4cCI6MTYzODMwOTQ4MCwiaWF0IjoxNjM4MzA1ODgwLCJqdGkiOiIxNzZmNDE3My1iNGU4LTQ1OTUtYWZlNC03YjkzMWUxMWNjNDkiLCJ1c2VybmFtZSI6ImNhNzEwYTRlLTBmN2MtNDg0NS1hZDZjLTI5ZGMwNzA2M2JhYiJ9.Y68CNG5d_yaRUTBrJ5O0Sn8Lwnhq85X3UwHYElQ7p0SqLTE55lJ3mVVZICnbqvKwXYWjbbOBBBHy-lVlck_a4lWYyccIWtrSe7HJa6YPuwVVA-k60WAWJ-sHDlS4cW8eephyg2d62yRfierGTSFT8vH64KEniEtaANGDOEMoQebTr7m-HGdKKHgubFwgP9u4EewDYfjz0IX39aaf_27eM8sD5foofwAmQ_HvbyObyRj45el24G5W84Iiil04A1FuZcmKxobz2PIgWwhA15PkmIwKFdSN0WnZmcpTsAoW9ecla6Y2BBoNjtdZNlZCX_RkuhH5j_pHBdlopq_om4ruQw',
        ExpiresIn: 3600,
        TokenType: 'Bearer',
        RefreshToken: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.zTtA-IMsgX0bZPe3W3Ot2kp4IYz2C6ZjMtSCx8vL7goIwlG_abwIF2JfJUkdW3vIsjnzfFKAsUAKptk0LkYgxxPivT3657JdqrUH1d_znvYN47WG3T_668PEpTXYzeW2wKWfYZBm37cK9ZzRBbqgoe-yX0L2N6r0I8cMVlKrudN50VCtKbXCHVuMeSce1PsPETRPbhDr-ibXuvyxND8zpfW1fCCsd-d7acxe1ksKgPmUvkngat6xBalqbUHtI8q0VASypqY79-YxyRg6aGrwO2i49XNF_0aTinmo8GJTbsG15B7gSymSoz5qeOQPsNwAlMtEKH_c6iMQkc2zQyUclw.BTOLP3rxPy6V12wK.NpjfNKzH5IpAyPoAP_1sQwvDavLehm-eu_x_YSg7DzGLJu7nHk0S1L7PIZuQuDebjf_Y9sP4R908hXO6HwwoojbpBVPWAMflOyCSfAdx3T0n4BZEANSU3f02XWTT8Yvta2MfBBVsDAj6j8qq-6aHWRxpkKCMLYHXnJZPuLn6PVPb2AmIBRAfn3MWDTD8Kpx4SjO4Zi7MyGN6Pbpm0A3-b08p3pvkvNQbOIMKnJ2l4kTxndsk_tYvB7hkGxLDOF6Ue80pwPKAiwvupaIIHmGT1eRNIEU30qfRc_RQ4MgNqybIeieQx58BPFwmYUCUkrNdsi1IISvGzDCZ_aP2puEbyHQ9mBLZ5MUNDmW4d-KCdCAP_MdZ7ZAciCnguS2oNcv6gyxX_RYZNzj3kprk_295lHAJUM11RaVSLKmwDB6xpjzCS9gY7unyMeoPYH-_lEwZRFIz532Q3xoO3k1YP_q5-CXoMDLeVZVBRiFe4P9ZIr7quibYLbdbQehoXtO6Tvj19UT7OwOmNJ6BT1YaT-Ift3zIVpbGbPWOsdHkA8wg4rbAtO3IZuDsuIkUtW1TPhQfw8crsf9yZfoB2nbGwJG_3FWaapsxT9yc4zc6HumaSWkrv9Yue-EwOQnPyF_s69B0Drib_J9MzA5557E2Dp3XRryv0C5WM9Ya5JDKBG1AoUexo1NTTIvaDGr9RbF-PNAGUFs-ljE7d1SYszleBjXpV-emWYDD_KNIL2veG_kw0Ij0DGgrh9pWQp1nTq6HcBKDcjO3izEDcucP2cxjsl749lyRs40zUH7oVGfbV6JvYaD6kFPyr0kxJhFnpeCFAQMi672PCDUWi9bjvRoT0OK5oLQ3d8013HUti5f6BJCw2cZ7aRLcOE6mjmrMXF0BDoTbqpIeiASXWaxpWVbVu3bqnLIhgoKueo53DTrr5qIAJa6g7vujKd4WvyfrL2syN8AqzjTT6W4fo2760L0W_tqiTYuVojPWhxUrus9b1Wcl7dZMypiGgKKEP92H1cuqzht-OLmPjO0uHI6SAPo1UGIgqdDqdh3tx0ALLCDjb1e93PJtJTOhLkfjQfqHgiG_pK3E3YYxnCJS_Sr4wH8gsbj7ZrR5dlUhX8Li_W3rcOgCNR9BXSmBa9BY8LYJl1JgZ2E7JjNn4odRnNnloGpemFQTKEbcNRY5T5LFgb4CUMAMLozh-YfykliH0-_DnIst2s1BgmL65TgzWUcBIPxrEj5IcJ-rG9c3oPkF8AZFZZGuXh6aG1-viIT6vQZynje9Cmq0VHHqugJWaDolCzzdG2oJdVoUIWfriLrQ-7yxrU73iS7v9Ed0UN5O-Fzh.D0ItofbYCmFkoh_8UO-yhg',
        IdToken: 'eyJraWQiOiJZejk3Q05TSGl1RitOWVJkeTJOUVNZbTFmb0d2dXJZenJCNGxucDJZQ1BJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjYTcxMGE0ZS0wZjdjLTQ4NDUtYWQ2Yy0yOWRjMDcwNjNiYWIiLCJjb2duaXRvOmdyb3VwcyI6WyJpbnZva2UtYXBpIl0sImNvZ25pdG86cHJlZmVycmVkX3JvbGUiOiJhcm46YXdzOmlhbTo6NTgzMDgxNzg0MzEzOnJvbGVcL2lhbV9yX2NvZ25pdG9fc2VjdXJlX2ludm9rZS1hcGkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9Xem80djhldzUiLCJjb2duaXRvOnVzZXJuYW1lIjoiY2E3MTBhNGUtMGY3Yy00ODQ1LWFkNmMtMjlkYzA3MDYzYmFiIiwib3JpZ2luX2p0aSI6IjZmNzdhMTJhLThlMjgtNDhhOC1iMDRkLWUwN2I1ZTM3ZDE3YiIsImNvZ25pdG86cm9sZXMiOlsiYXJuOmF3czppYW06OjU4MzA4MTc4NDMxMzpyb2xlXC9pYW1fcl9jb2duaXRvX3NlY3VyZV9pbnZva2UtYXBpIl0sImF1ZCI6ImNia3RiaWgxOW02ZHNycGM3aGhjaW1uaCIsImV2ZW50X2lkIjoiMWViMjkzY2QtZmRmMC00NjFiLTliODMtMGU1NDJiNDExZjFmIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MzgzMDU4ODAsInBob25lX251bWJlciI6Iis1NjExMTExMTExMTEiLCJleHAiOjE2MzgzMDk0ODAsImlhdCI6MTYzODMwNTg4MCwianRpIjoiNTE5MGEyMDktNWQ4Yy00NzQzLTk2MGEtNzBmZjkxYjJlZDc0IiwiZW1haWwiOiJhbGV4aXMucG9yY2VsQGluY2x1aXQuY29tIn0.VxMHyPCLTu0XxfrUll1WLqgrDZPz6z4wpuwBmtvOMY-XQSHwffW7QpXiHvfq-oAWgVXOtWWOq7AvsuibHipsEMc55BZy3ZX-bGfGvAFRkPAv9JZOcCjCqgZRbfCjTXqE-F-3mGyKnbCGfeStebBbwwRgFCs5OQ2zIug6708iPwhaYZ7-vmoaRpEpg0ftaIebM4zTIySfnbURs2cpNGkQjMJJZwHuouSHVHM9bXB8-IfC29qL7evll2yOLo4IgnyNRmbUbaB2JH1DyMAdltDgb5nJ4kSBNUuZTLlw0-whoE_3F_i1adNHTTredDnDTceUR4NODq27VBEmm8eP4cTH8Q',
      },
    });

    const Cognito = jest.fn().mockImplementation(() => ({
      adminGetUser,
      adminInitiateAuth,
    }));

    const uuid = { v4: jest.fn().mockReturnValue('4e6272f6-737c-4f99-8439-1d2f080bbe62') };

    const awsRepositories = {
      Repository: {
        create: jest.fn().mockResolvedValue({
          TableName: 'devExternalUserSession',
          Item: {
            id: '4e6272f6-737c-4f99-8439-1d2f080bbe62',
            AccessToken: 'eyJraWQiOiJGNVA1TUxvVkhCb2w3R2srYUlpdnhMTGVSYWF1amtZaWJkeW02WlhURGxjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjYTcxMGE0ZS0wZjdjLTQ4NDUtYWQ2Yy0yOWRjMDcwNjNiYWIiLCJjb2duaXRvOmdyb3VwcyI6WyJpbnZva2UtYXBpIl0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1d6bzR2OGV3NSIsImNsaWVudF9pZCI6ImNia3RiaWgxOW02ZHNycGM3aGhjaW1uaCIsIm9yaWdpbl9qdGkiOiI2Zjc3YTEyYS04ZTI4LTQ4YTgtYjA0ZC1lMDdiNWUzN2QxN2IiLCJldmVudF9pZCI6IjFlYjI5M2NkLWZkZjAtNDYxYi05YjgzLTBlNTQyYjQxMWYxZiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2MzgzMDU4ODAsImV4cCI6MTYzODMwOTQ4MCwiaWF0IjoxNjM4MzA1ODgwLCJqdGkiOiIxNzZmNDE3My1iNGU4LTQ1OTUtYWZlNC03YjkzMWUxMWNjNDkiLCJ1c2VybmFtZSI6ImNhNzEwYTRlLTBmN2MtNDg0NS1hZDZjLTI5ZGMwNzA2M2JhYiJ9.Y68CNG5d_yaRUTBrJ5O0Sn8Lwnhq85X3UwHYElQ7p0SqLTE55lJ3mVVZICnbqvKwXYWjbbOBBBHy-lVlck_a4lWYyccIWtrSe7HJa6YPuwVVA-k60WAWJ-sHDlS4cW8eephyg2d62yRfierGTSFT8vH64KEniEtaANGDOEMoQebTr7m-HGdKKHgubFwgP9u4EewDYfjz0IX39aaf_27eM8sD5foofwAmQ_HvbyObyRj45el24G5W84Iiil04A1FuZcmKxobz2PIgWwhA15PkmIwKFdSN0WnZmcpTsAoW9ecla6Y2BBoNjtdZNlZCX_RkuhH5j_pHBdlopq_om4ruQw',
            ExpiresIn: 3600,
            TokenType: 'Bearer',
            RefreshToken: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.zTtA-IMsgX0bZPe3W3Ot2kp4IYz2C6ZjMtSCx8vL7goIwlG_abwIF2JfJUkdW3vIsjnzfFKAsUAKptk0LkYgxxPivT3657JdqrUH1d_znvYN47WG3T_668PEpTXYzeW2wKWfYZBm37cK9ZzRBbqgoe-yX0L2N6r0I8cMVlKrudN50VCtKbXCHVuMeSce1PsPETRPbhDr-ibXuvyxND8zpfW1fCCsd-d7acxe1ksKgPmUvkngat6xBalqbUHtI8q0VASypqY79-YxyRg6aGrwO2i49XNF_0aTinmo8GJTbsG15B7gSymSoz5qeOQPsNwAlMtEKH_c6iMQkc2zQyUclw.BTOLP3rxPy6V12wK.NpjfNKzH5IpAyPoAP_1sQwvDavLehm-eu_x_YSg7DzGLJu7nHk0S1L7PIZuQuDebjf_Y9sP4R908hXO6HwwoojbpBVPWAMflOyCSfAdx3T0n4BZEANSU3f02XWTT8Yvta2MfBBVsDAj6j8qq-6aHWRxpkKCMLYHXnJZPuLn6PVPb2AmIBRAfn3MWDTD8Kpx4SjO4Zi7MyGN6Pbpm0A3-b08p3pvkvNQbOIMKnJ2l4kTxndsk_tYvB7hkGxLDOF6Ue80pwPKAiwvupaIIHmGT1eRNIEU30qfRc_RQ4MgNqybIeieQx58BPFwmYUCUkrNdsi1IISvGzDCZ_aP2puEbyHQ9mBLZ5MUNDmW4d-KCdCAP_MdZ7ZAciCnguS2oNcv6gyxX_RYZNzj3kprk_295lHAJUM11RaVSLKmwDB6xpjzCS9gY7unyMeoPYH-_lEwZRFIz532Q3xoO3k1YP_q5-CXoMDLeVZVBRiFe4P9ZIr7quibYLbdbQehoXtO6Tvj19UT7OwOmNJ6BT1YaT-Ift3zIVpbGbPWOsdHkA8wg4rbAtO3IZuDsuIkUtW1TPhQfw8crsf9yZfoB2nbGwJG_3FWaapsxT9yc4zc6HumaSWkrv9Yue-EwOQnPyF_s69B0Drib_J9MzA5557E2Dp3XRryv0C5WM9Ya5JDKBG1AoUexo1NTTIvaDGr9RbF-PNAGUFs-ljE7d1SYszleBjXpV-emWYDD_KNIL2veG_kw0Ij0DGgrh9pWQp1nTq6HcBKDcjO3izEDcucP2cxjsl749lyRs40zUH7oVGfbV6JvYaD6kFPyr0kxJhFnpeCFAQMi672PCDUWi9bjvRoT0OK5oLQ3d8013HUti5f6BJCw2cZ7aRLcOE6mjmrMXF0BDoTbqpIeiASXWaxpWVbVu3bqnLIhgoKueo53DTrr5qIAJa6g7vujKd4WvyfrL2syN8AqzjTT6W4fo2760L0W_tqiTYuVojPWhxUrus9b1Wcl7dZMypiGgKKEP92H1cuqzht-OLmPjO0uHI6SAPo1UGIgqdDqdh3tx0ALLCDjb1e93PJtJTOhLkfjQfqHgiG_pK3E3YYxnCJS_Sr4wH8gsbj7ZrR5dlUhX8Li_W3rcOgCNR9BXSmBa9BY8LYJl1JgZ2E7JjNn4odRnNnloGpemFQTKEbcNRY5T5LFgb4CUMAMLozh-YfykliH0-_DnIst2s1BgmL65TgzWUcBIPxrEj5IcJ-rG9c3oPkF8AZFZZGuXh6aG1-viIT6vQZynje9Cmq0VHHqugJWaDolCzzdG2oJdVoUIWfriLrQ-7yxrU73iS7v9Ed0UN5O-Fzh.D0ItofbYCmFkoh_8UO-yhg',
            IdToken: 'eyJraWQiOiJZejk3Q05TSGl1RitOWVJkeTJOUVNZbTFmb0d2dXJZenJCNGxucDJZQ1BJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjYTcxMGE0ZS0wZjdjLTQ4NDUtYWQ2Yy0yOWRjMDcwNjNiYWIiLCJjb2duaXRvOmdyb3VwcyI6WyJpbnZva2UtYXBpIl0sImNvZ25pdG86cHJlZmVycmVkX3JvbGUiOiJhcm46YXdzOmlhbTo6NTgzMDgxNzg0MzEzOnJvbGVcL2lhbV9yX2NvZ25pdG9fc2VjdXJlX2ludm9rZS1hcGkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9Xem80djhldzUiLCJjb2duaXRvOnVzZXJuYW1lIjoiY2E3MTBhNGUtMGY3Yy00ODQ1LWFkNmMtMjlkYzA3MDYzYmFiIiwib3JpZ2luX2p0aSI6IjZmNzdhMTJhLThlMjgtNDhhOC1iMDRkLWUwN2I1ZTM3ZDE3YiIsImNvZ25pdG86cm9sZXMiOlsiYXJuOmF3czppYW06OjU4MzA4MTc4NDMxMzpyb2xlXC9pYW1fcl9jb2duaXRvX3NlY3VyZV9pbnZva2UtYXBpIl0sImF1ZCI6ImNia3RiaWgxOW02ZHNycGM3aGhjaW1uaCIsImV2ZW50X2lkIjoiMWViMjkzY2QtZmRmMC00NjFiLTliODMtMGU1NDJiNDExZjFmIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MzgzMDU4ODAsInBob25lX251bWJlciI6Iis1NjExMTExMTExMTEiLCJleHAiOjE2MzgzMDk0ODAsImlhdCI6MTYzODMwNTg4MCwianRpIjoiNTE5MGEyMDktNWQ4Yy00NzQzLTk2MGEtNzBmZjkxYjJlZDc0IiwiZW1haWwiOiJhbGV4aXMucG9yY2VsQGluY2x1aXQuY29tIn0.VxMHyPCLTu0XxfrUll1WLqgrDZPz6z4wpuwBmtvOMY-XQSHwffW7QpXiHvfq-oAWgVXOtWWOq7AvsuibHipsEMc55BZy3ZX-bGfGvAFRkPAv9JZOcCjCqgZRbfCjTXqE-F-3mGyKnbCGfeStebBbwwRgFCs5OQ2zIug6708iPwhaYZ7-vmoaRpEpg0ftaIebM4zTIySfnbURs2cpNGkQjMJJZwHuouSHVHM9bXB8-IfC29qL7evll2yOLo4IgnyNRmbUbaB2JH1DyMAdltDgb5nJ4kSBNUuZTLlw0-whoE_3F_i1adNHTTredDnDTceUR4NODq27VBEmm8eP4cTH8Q',
            clientId: 1,
          },
        }),
      },
    };

    const { userLoginService } = handler({
      repositories,
      experts,
      res,
      awsConfig,
      getEncryption,
      handlerErrorCode,
      Cognito,
      awsRepositories,
      uuid,
    });

    await userLoginService(event);

    expect(experts.user.validateUserLogin.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          email: 'test@gmail.com',
          password: 'Password@123',
          erpClientId: '0500000001',
        },
      ],
    ]);
    expect(awsConfig.getSecretEncryptionKey.mock.calls).toEqual([]);
    expect(getEncryption().decrypt.mock.calls).toEqual([]);
    expect(adminGetUser.mock.calls).toEqual([]);
    expect(adminInitiateAuth.mock.calls).toEqual([]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([]);
    expect(res.status.mock.calls).toEqual([]);
    expect(res.status().json.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'Validation_server_error',
        2000,
        'Validation_error',
        400,
      ],
    ]);
  });

  it('It should return a handled error in case of failure to Cognito', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      email: 'test@gmail.com',
      password: 'Password@123',
      erpClientId: '0500000001',
    };

    const repositories = jest.fn().mockResolvedValue({
      User: { getUserByEmailOrPhoneAndTenant: jest.fn().mockResolvedValue({ username: 'pepito' }) },
      Client: { getClientIdByErpId: jest.fn().mockResolvedValue({ clientId: 1 }) },
      closeConnection: jest.fn(),
    });

    const experts = {
      user: {
        validateUserLogin: jest.fn(),
        validateLoginFoundUser: jest.fn(),
      },
      client: { validateExistsResult: jest.fn() },
    };

    const handlerErrorCode = {
      resetCode: jest.fn().mockReturnValue({
        message: 'Invalid code provided, please request a code again.',
        name: 'ExpiredCodeException',
        code: 2201,
      }),
    };

    const getEncryption = jest.fn().mockReturnValue({ decrypt: jest.fn().mockReturnValue('Password@123') });

    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn().mockReturnValue({}) }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const awsConfig = {
      getSecretEncryptionKey: jest.fn().mockResolvedValue({ key: 'eee' }),
      getCognitoInfo: jest.fn().mockResolvedValue({
        USER_POOL_ID: 'USER_POOL_ID_test',
        CLIENT_ID: 'CLIENT_ID_test',
      }),
    };

    const adminGetUser = jest.fn().mockResolvedValue({
      Username: 'ca710a4e-0f7c-4845-ad6c-29dc07063bab',
      UserAttributes: [
        {
          Name: 'sub',
          Value: 'ca710a4e-0f7c-4845-ad6c-29dc07063bab',
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
        {
          Name: 'phone_number_verified',
          Value: 'false',
        },
        {
          Name: 'phone_number',
          Value: '+561111111111',
        },
        {
          Name: 'email',
          Value: 'test@gmail.com',
        },
      ],
      UserCreateDate: '2021-10-13T15:46:44.089Z',
      UserLastModifiedDate: '2021-10-13T15:46:58.367Z',
      Enabled: true,
      UserStatus: 'CONFIRMED',
    });

    const adminInitiateAuth = jest.fn(() => {
      throw {
        name: 'UserNotFoundException',
        message: 'User not found',
        code: 2200,
      };
    });

    const Cognito = jest.fn().mockImplementation(() => ({
      adminGetUser,
      adminInitiateAuth,
    }));

    const uuid = { v4: jest.fn().mockReturnValue('4e6272f6-737c-4f99-8439-1d2f080bbe62') };

    const awsRepositories = {
      Repository: {
        create: jest.fn().mockResolvedValue({
          TableName: 'devExternalUserSession',
          Item: {
            id: '4e6272f6-737c-4f99-8439-1d2f080bbe62',
            AccessToken: 'eyJraWQiOiJGNVA1TUxvVkhCb2w3R2srYUlpdnhMTGVSYWF1amtZaWJkeW02WlhURGxjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjYTcxMGE0ZS0wZjdjLTQ4NDUtYWQ2Yy0yOWRjMDcwNjNiYWIiLCJjb2duaXRvOmdyb3VwcyI6WyJpbnZva2UtYXBpIl0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1d6bzR2OGV3NSIsImNsaWVudF9pZCI6ImNia3RiaWgxOW02ZHNycGM3aGhjaW1uaCIsIm9yaWdpbl9qdGkiOiI2Zjc3YTEyYS04ZTI4LTQ4YTgtYjA0ZC1lMDdiNWUzN2QxN2IiLCJldmVudF9pZCI6IjFlYjI5M2NkLWZkZjAtNDYxYi05YjgzLTBlNTQyYjQxMWYxZiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2MzgzMDU4ODAsImV4cCI6MTYzODMwOTQ4MCwiaWF0IjoxNjM4MzA1ODgwLCJqdGkiOiIxNzZmNDE3My1iNGU4LTQ1OTUtYWZlNC03YjkzMWUxMWNjNDkiLCJ1c2VybmFtZSI6ImNhNzEwYTRlLTBmN2MtNDg0NS1hZDZjLTI5ZGMwNzA2M2JhYiJ9.Y68CNG5d_yaRUTBrJ5O0Sn8Lwnhq85X3UwHYElQ7p0SqLTE55lJ3mVVZICnbqvKwXYWjbbOBBBHy-lVlck_a4lWYyccIWtrSe7HJa6YPuwVVA-k60WAWJ-sHDlS4cW8eephyg2d62yRfierGTSFT8vH64KEniEtaANGDOEMoQebTr7m-HGdKKHgubFwgP9u4EewDYfjz0IX39aaf_27eM8sD5foofwAmQ_HvbyObyRj45el24G5W84Iiil04A1FuZcmKxobz2PIgWwhA15PkmIwKFdSN0WnZmcpTsAoW9ecla6Y2BBoNjtdZNlZCX_RkuhH5j_pHBdlopq_om4ruQw',
            ExpiresIn: 3600,
            TokenType: 'Bearer',
            RefreshToken: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.zTtA-IMsgX0bZPe3W3Ot2kp4IYz2C6ZjMtSCx8vL7goIwlG_abwIF2JfJUkdW3vIsjnzfFKAsUAKptk0LkYgxxPivT3657JdqrUH1d_znvYN47WG3T_668PEpTXYzeW2wKWfYZBm37cK9ZzRBbqgoe-yX0L2N6r0I8cMVlKrudN50VCtKbXCHVuMeSce1PsPETRPbhDr-ibXuvyxND8zpfW1fCCsd-d7acxe1ksKgPmUvkngat6xBalqbUHtI8q0VASypqY79-YxyRg6aGrwO2i49XNF_0aTinmo8GJTbsG15B7gSymSoz5qeOQPsNwAlMtEKH_c6iMQkc2zQyUclw.BTOLP3rxPy6V12wK.NpjfNKzH5IpAyPoAP_1sQwvDavLehm-eu_x_YSg7DzGLJu7nHk0S1L7PIZuQuDebjf_Y9sP4R908hXO6HwwoojbpBVPWAMflOyCSfAdx3T0n4BZEANSU3f02XWTT8Yvta2MfBBVsDAj6j8qq-6aHWRxpkKCMLYHXnJZPuLn6PVPb2AmIBRAfn3MWDTD8Kpx4SjO4Zi7MyGN6Pbpm0A3-b08p3pvkvNQbOIMKnJ2l4kTxndsk_tYvB7hkGxLDOF6Ue80pwPKAiwvupaIIHmGT1eRNIEU30qfRc_RQ4MgNqybIeieQx58BPFwmYUCUkrNdsi1IISvGzDCZ_aP2puEbyHQ9mBLZ5MUNDmW4d-KCdCAP_MdZ7ZAciCnguS2oNcv6gyxX_RYZNzj3kprk_295lHAJUM11RaVSLKmwDB6xpjzCS9gY7unyMeoPYH-_lEwZRFIz532Q3xoO3k1YP_q5-CXoMDLeVZVBRiFe4P9ZIr7quibYLbdbQehoXtO6Tvj19UT7OwOmNJ6BT1YaT-Ift3zIVpbGbPWOsdHkA8wg4rbAtO3IZuDsuIkUtW1TPhQfw8crsf9yZfoB2nbGwJG_3FWaapsxT9yc4zc6HumaSWkrv9Yue-EwOQnPyF_s69B0Drib_J9MzA5557E2Dp3XRryv0C5WM9Ya5JDKBG1AoUexo1NTTIvaDGr9RbF-PNAGUFs-ljE7d1SYszleBjXpV-emWYDD_KNIL2veG_kw0Ij0DGgrh9pWQp1nTq6HcBKDcjO3izEDcucP2cxjsl749lyRs40zUH7oVGfbV6JvYaD6kFPyr0kxJhFnpeCFAQMi672PCDUWi9bjvRoT0OK5oLQ3d8013HUti5f6BJCw2cZ7aRLcOE6mjmrMXF0BDoTbqpIeiASXWaxpWVbVu3bqnLIhgoKueo53DTrr5qIAJa6g7vujKd4WvyfrL2syN8AqzjTT6W4fo2760L0W_tqiTYuVojPWhxUrus9b1Wcl7dZMypiGgKKEP92H1cuqzht-OLmPjO0uHI6SAPo1UGIgqdDqdh3tx0ALLCDjb1e93PJtJTOhLkfjQfqHgiG_pK3E3YYxnCJS_Sr4wH8gsbj7ZrR5dlUhX8Li_W3rcOgCNR9BXSmBa9BY8LYJl1JgZ2E7JjNn4odRnNnloGpemFQTKEbcNRY5T5LFgb4CUMAMLozh-YfykliH0-_DnIst2s1BgmL65TgzWUcBIPxrEj5IcJ-rG9c3oPkF8AZFZZGuXh6aG1-viIT6vQZynje9Cmq0VHHqugJWaDolCzzdG2oJdVoUIWfriLrQ-7yxrU73iS7v9Ed0UN5O-Fzh.D0ItofbYCmFkoh_8UO-yhg',
            IdToken: 'eyJraWQiOiJZejk3Q05TSGl1RitOWVJkeTJOUVNZbTFmb0d2dXJZenJCNGxucDJZQ1BJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjYTcxMGE0ZS0wZjdjLTQ4NDUtYWQ2Yy0yOWRjMDcwNjNiYWIiLCJjb2duaXRvOmdyb3VwcyI6WyJpbnZva2UtYXBpIl0sImNvZ25pdG86cHJlZmVycmVkX3JvbGUiOiJhcm46YXdzOmlhbTo6NTgzMDgxNzg0MzEzOnJvbGVcL2lhbV9yX2NvZ25pdG9fc2VjdXJlX2ludm9rZS1hcGkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9Xem80djhldzUiLCJjb2duaXRvOnVzZXJuYW1lIjoiY2E3MTBhNGUtMGY3Yy00ODQ1LWFkNmMtMjlkYzA3MDYzYmFiIiwib3JpZ2luX2p0aSI6IjZmNzdhMTJhLThlMjgtNDhhOC1iMDRkLWUwN2I1ZTM3ZDE3YiIsImNvZ25pdG86cm9sZXMiOlsiYXJuOmF3czppYW06OjU4MzA4MTc4NDMxMzpyb2xlXC9pYW1fcl9jb2duaXRvX3NlY3VyZV9pbnZva2UtYXBpIl0sImF1ZCI6ImNia3RiaWgxOW02ZHNycGM3aGhjaW1uaCIsImV2ZW50X2lkIjoiMWViMjkzY2QtZmRmMC00NjFiLTliODMtMGU1NDJiNDExZjFmIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MzgzMDU4ODAsInBob25lX251bWJlciI6Iis1NjExMTExMTExMTEiLCJleHAiOjE2MzgzMDk0ODAsImlhdCI6MTYzODMwNTg4MCwianRpIjoiNTE5MGEyMDktNWQ4Yy00NzQzLTk2MGEtNzBmZjkxYjJlZDc0IiwiZW1haWwiOiJhbGV4aXMucG9yY2VsQGluY2x1aXQuY29tIn0.VxMHyPCLTu0XxfrUll1WLqgrDZPz6z4wpuwBmtvOMY-XQSHwffW7QpXiHvfq-oAWgVXOtWWOq7AvsuibHipsEMc55BZy3ZX-bGfGvAFRkPAv9JZOcCjCqgZRbfCjTXqE-F-3mGyKnbCGfeStebBbwwRgFCs5OQ2zIug6708iPwhaYZ7-vmoaRpEpg0ftaIebM4zTIySfnbURs2cpNGkQjMJJZwHuouSHVHM9bXB8-IfC29qL7evll2yOLo4IgnyNRmbUbaB2JH1DyMAdltDgb5nJ4kSBNUuZTLlw0-whoE_3F_i1adNHTTredDnDTceUR4NODq27VBEmm8eP4cTH8Q',
            clientId: 1,
          },
        }),
      },
    };

    const { userLoginService } = handler({
      repositories,
      experts,
      res,
      awsConfig,
      getEncryption,
      handlerErrorCode,
      Cognito,
      awsRepositories,
      uuid,
    });

    await userLoginService(event);

    expect(experts.user.validateUserLogin.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          email: 'test@gmail.com',
          password: 'Password@123',
          erpClientId: '0500000001',
        },
      ],
    ]);
    expect(awsConfig.getSecretEncryptionKey.mock.calls).toEqual([ [] ]);
    expect(getEncryption().decrypt.mock.calls).toEqual([
      [
        'Password@123',
        'eee',
      ],
    ]);
    expect(adminGetUser.mock.calls).toEqual([
      [
        {
          Username: 'test@gmail.com',
          UserPoolId: 'USER_POOL_ID_test',
        },
      ],
    ]);
    expect(adminInitiateAuth.mock.calls).toEqual([
      [

        {
          UserPoolId: 'USER_POOL_ID_test',
          ClientId: 'CLIENT_ID_test',
          AuthParameters:
                    {
                      USERNAME: 'ca710a4e-0f7c-4845-ad6c-29dc07063bab',
                      PASSWORD: 'Password@123',
                    },
        },

      ],
    ]);
    expect(res.status.mock.calls).toEqual([]);
    expect(res.status().json.mock.calls).toEqual([]);
    expect(handlerErrorCode.resetCode.mock.calls).toEqual([
      [
        {
          code: 2200,
          message: 'User not found',
          name: 'UserNotFoundException',
        },
      ],
    ]);
    expect(res.error.mock.calls).toEqual([
      [
        'Invalid code provided, please request a code again.',
        2201,
        'ExpiredCodeException',
        400,
      ],
    ]);
  });

  it('It should return a error, this error is not a handled error.', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      email: 'test@gmail.com',
      password: 'Password@123',
      erpClientId: '0500000001',
    };

    const repositories = jest.fn().mockResolvedValue({
      User: { getUserByEmailOrPhoneAndTenant: jest.fn().mockResolvedValue({ username: 'pepito' }) },
      Client: { getClientIdByErpId: jest.fn().mockResolvedValue({ clientId: 1 }) },
      closeConnection: jest.fn(),
    });

    const experts = {
      user: {
        validateUserLogin: jest.fn(),
        validateLoginFoundUser: jest.fn(),
      },
      client: { validateExistsResult: jest.fn() },
    };

    const handlerErrorCode = { resetCode: jest.fn() };

    const getEncryption = jest.fn().mockReturnValue({ decrypt: jest.fn().mockReturnValue('Password@123') });

    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn().mockReturnValue({}) }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const awsConfig = {
      getSecretEncryptionKey: jest.fn().mockResolvedValue({ key: 'eee' }),
      getCognitoInfo: jest.fn().mockResolvedValue({
        USER_POOL_ID: 'USER_POOL_ID_test',
        CLIENT_ID: 'CLIENT_ID_test',
      }),
    };



    const adminGetUser = jest.fn().mockResolvedValue({
      Username: 'ca710a4e-0f7c-4845-ad6c-29dc07063bab',
      UserAttributes: [
        {
          Name: 'sub',
          Value: 'ca710a4e-0f7c-4845-ad6c-29dc07063bab',
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
        {
          Name: 'phone_number_verified',
          Value: 'false',
        },
        {
          Name: 'phone_number',
          Value: '+561111111111',
        },
        {
          Name: 'email',
          Value: 'test@gmail.com',
        },
      ],
      UserCreateDate: '2021-10-13T15:46:44.089Z',
      UserLastModifiedDate: '2021-10-13T15:46:58.367Z',
      Enabled: true,
      UserStatus: 'CONFIRMED',
    });

    const adminInitiateAuth = jest.fn(() => {
      throw {
        httpStatus: 500,
        ok: false,
        code: 0,
        errorType: 'Server_Error',
        message: 'internal_server_error',
      };
    });

    const Cognito = jest.fn().mockImplementation(() => ({
      adminGetUser,
      adminInitiateAuth,
    }));

    const uuid = { v4: jest.fn().mockReturnValue('4e6272f6-737c-4f99-8439-1d2f080bbe62') };

    const awsRepositories = {
      Repository: {
        create: jest.fn().mockResolvedValue({
          TableName: 'devExternalUserSession',
          Item: {
            id: '4e6272f6-737c-4f99-8439-1d2f080bbe62',
            AccessToken: 'eyJraWQiOiJGNVA1TUxvVkhCb2w3R2srYUlpdnhMTGVSYWF1amtZaWJkeW02WlhURGxjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjYTcxMGE0ZS0wZjdjLTQ4NDUtYWQ2Yy0yOWRjMDcwNjNiYWIiLCJjb2duaXRvOmdyb3VwcyI6WyJpbnZva2UtYXBpIl0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1d6bzR2OGV3NSIsImNsaWVudF9pZCI6ImNia3RiaWgxOW02ZHNycGM3aGhjaW1uaCIsIm9yaWdpbl9qdGkiOiI2Zjc3YTEyYS04ZTI4LTQ4YTgtYjA0ZC1lMDdiNWUzN2QxN2IiLCJldmVudF9pZCI6IjFlYjI5M2NkLWZkZjAtNDYxYi05YjgzLTBlNTQyYjQxMWYxZiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2MzgzMDU4ODAsImV4cCI6MTYzODMwOTQ4MCwiaWF0IjoxNjM4MzA1ODgwLCJqdGkiOiIxNzZmNDE3My1iNGU4LTQ1OTUtYWZlNC03YjkzMWUxMWNjNDkiLCJ1c2VybmFtZSI6ImNhNzEwYTRlLTBmN2MtNDg0NS1hZDZjLTI5ZGMwNzA2M2JhYiJ9.Y68CNG5d_yaRUTBrJ5O0Sn8Lwnhq85X3UwHYElQ7p0SqLTE55lJ3mVVZICnbqvKwXYWjbbOBBBHy-lVlck_a4lWYyccIWtrSe7HJa6YPuwVVA-k60WAWJ-sHDlS4cW8eephyg2d62yRfierGTSFT8vH64KEniEtaANGDOEMoQebTr7m-HGdKKHgubFwgP9u4EewDYfjz0IX39aaf_27eM8sD5foofwAmQ_HvbyObyRj45el24G5W84Iiil04A1FuZcmKxobz2PIgWwhA15PkmIwKFdSN0WnZmcpTsAoW9ecla6Y2BBoNjtdZNlZCX_RkuhH5j_pHBdlopq_om4ruQw',
            ExpiresIn: 3600,
            TokenType: 'Bearer',
            RefreshToken: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.zTtA-IMsgX0bZPe3W3Ot2kp4IYz2C6ZjMtSCx8vL7goIwlG_abwIF2JfJUkdW3vIsjnzfFKAsUAKptk0LkYgxxPivT3657JdqrUH1d_znvYN47WG3T_668PEpTXYzeW2wKWfYZBm37cK9ZzRBbqgoe-yX0L2N6r0I8cMVlKrudN50VCtKbXCHVuMeSce1PsPETRPbhDr-ibXuvyxND8zpfW1fCCsd-d7acxe1ksKgPmUvkngat6xBalqbUHtI8q0VASypqY79-YxyRg6aGrwO2i49XNF_0aTinmo8GJTbsG15B7gSymSoz5qeOQPsNwAlMtEKH_c6iMQkc2zQyUclw.BTOLP3rxPy6V12wK.NpjfNKzH5IpAyPoAP_1sQwvDavLehm-eu_x_YSg7DzGLJu7nHk0S1L7PIZuQuDebjf_Y9sP4R908hXO6HwwoojbpBVPWAMflOyCSfAdx3T0n4BZEANSU3f02XWTT8Yvta2MfBBVsDAj6j8qq-6aHWRxpkKCMLYHXnJZPuLn6PVPb2AmIBRAfn3MWDTD8Kpx4SjO4Zi7MyGN6Pbpm0A3-b08p3pvkvNQbOIMKnJ2l4kTxndsk_tYvB7hkGxLDOF6Ue80pwPKAiwvupaIIHmGT1eRNIEU30qfRc_RQ4MgNqybIeieQx58BPFwmYUCUkrNdsi1IISvGzDCZ_aP2puEbyHQ9mBLZ5MUNDmW4d-KCdCAP_MdZ7ZAciCnguS2oNcv6gyxX_RYZNzj3kprk_295lHAJUM11RaVSLKmwDB6xpjzCS9gY7unyMeoPYH-_lEwZRFIz532Q3xoO3k1YP_q5-CXoMDLeVZVBRiFe4P9ZIr7quibYLbdbQehoXtO6Tvj19UT7OwOmNJ6BT1YaT-Ift3zIVpbGbPWOsdHkA8wg4rbAtO3IZuDsuIkUtW1TPhQfw8crsf9yZfoB2nbGwJG_3FWaapsxT9yc4zc6HumaSWkrv9Yue-EwOQnPyF_s69B0Drib_J9MzA5557E2Dp3XRryv0C5WM9Ya5JDKBG1AoUexo1NTTIvaDGr9RbF-PNAGUFs-ljE7d1SYszleBjXpV-emWYDD_KNIL2veG_kw0Ij0DGgrh9pWQp1nTq6HcBKDcjO3izEDcucP2cxjsl749lyRs40zUH7oVGfbV6JvYaD6kFPyr0kxJhFnpeCFAQMi672PCDUWi9bjvRoT0OK5oLQ3d8013HUti5f6BJCw2cZ7aRLcOE6mjmrMXF0BDoTbqpIeiASXWaxpWVbVu3bqnLIhgoKueo53DTrr5qIAJa6g7vujKd4WvyfrL2syN8AqzjTT6W4fo2760L0W_tqiTYuVojPWhxUrus9b1Wcl7dZMypiGgKKEP92H1cuqzht-OLmPjO0uHI6SAPo1UGIgqdDqdh3tx0ALLCDjb1e93PJtJTOhLkfjQfqHgiG_pK3E3YYxnCJS_Sr4wH8gsbj7ZrR5dlUhX8Li_W3rcOgCNR9BXSmBa9BY8LYJl1JgZ2E7JjNn4odRnNnloGpemFQTKEbcNRY5T5LFgb4CUMAMLozh-YfykliH0-_DnIst2s1BgmL65TgzWUcBIPxrEj5IcJ-rG9c3oPkF8AZFZZGuXh6aG1-viIT6vQZynje9Cmq0VHHqugJWaDolCzzdG2oJdVoUIWfriLrQ-7yxrU73iS7v9Ed0UN5O-Fzh.D0ItofbYCmFkoh_8UO-yhg',
            IdToken: 'eyJraWQiOiJZejk3Q05TSGl1RitOWVJkeTJOUVNZbTFmb0d2dXJZenJCNGxucDJZQ1BJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjYTcxMGE0ZS0wZjdjLTQ4NDUtYWQ2Yy0yOWRjMDcwNjNiYWIiLCJjb2duaXRvOmdyb3VwcyI6WyJpbnZva2UtYXBpIl0sImNvZ25pdG86cHJlZmVycmVkX3JvbGUiOiJhcm46YXdzOmlhbTo6NTgzMDgxNzg0MzEzOnJvbGVcL2lhbV9yX2NvZ25pdG9fc2VjdXJlX2ludm9rZS1hcGkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9Xem80djhldzUiLCJjb2duaXRvOnVzZXJuYW1lIjoiY2E3MTBhNGUtMGY3Yy00ODQ1LWFkNmMtMjlkYzA3MDYzYmFiIiwib3JpZ2luX2p0aSI6IjZmNzdhMTJhLThlMjgtNDhhOC1iMDRkLWUwN2I1ZTM3ZDE3YiIsImNvZ25pdG86cm9sZXMiOlsiYXJuOmF3czppYW06OjU4MzA4MTc4NDMxMzpyb2xlXC9pYW1fcl9jb2duaXRvX3NlY3VyZV9pbnZva2UtYXBpIl0sImF1ZCI6ImNia3RiaWgxOW02ZHNycGM3aGhjaW1uaCIsImV2ZW50X2lkIjoiMWViMjkzY2QtZmRmMC00NjFiLTliODMtMGU1NDJiNDExZjFmIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MzgzMDU4ODAsInBob25lX251bWJlciI6Iis1NjExMTExMTExMTEiLCJleHAiOjE2MzgzMDk0ODAsImlhdCI6MTYzODMwNTg4MCwianRpIjoiNTE5MGEyMDktNWQ4Yy00NzQzLTk2MGEtNzBmZjkxYjJlZDc0IiwiZW1haWwiOiJhbGV4aXMucG9yY2VsQGluY2x1aXQuY29tIn0.VxMHyPCLTu0XxfrUll1WLqgrDZPz6z4wpuwBmtvOMY-XQSHwffW7QpXiHvfq-oAWgVXOtWWOq7AvsuibHipsEMc55BZy3ZX-bGfGvAFRkPAv9JZOcCjCqgZRbfCjTXqE-F-3mGyKnbCGfeStebBbwwRgFCs5OQ2zIug6708iPwhaYZ7-vmoaRpEpg0ftaIebM4zTIySfnbURs2cpNGkQjMJJZwHuouSHVHM9bXB8-IfC29qL7evll2yOLo4IgnyNRmbUbaB2JH1DyMAdltDgb5nJ4kSBNUuZTLlw0-whoE_3F_i1adNHTTredDnDTceUR4NODq27VBEmm8eP4cTH8Q',
            username: 'pepito',
            clientId: 1,
          },
        }),
      },
    };

    const { userLoginService } = handler({
      repositories,
      experts,
      res,
      awsConfig,
      getEncryption,
      handlerErrorCode,
      Cognito,
      awsRepositories,
      uuid,
    });

    await userLoginService(event);

    expect(experts.user.validateUserLogin.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          email: 'test@gmail.com',
          password: 'Password@123',
          erpClientId: '0500000001',
        },
      ],
    ]);
    expect(awsConfig.getSecretEncryptionKey.mock.calls).toEqual([ [] ]);
    expect(getEncryption().decrypt.mock.calls).toEqual([
      [
        'Password@123',
        'eee',
      ],
    ]);
    expect(adminGetUser.mock.calls).toEqual([
      [
        {
          Username: 'test@gmail.com',
          UserPoolId: 'USER_POOL_ID_test',
        },
      ],
    ]);
    expect(adminInitiateAuth.mock.calls).toEqual([
      [

        {
          UserPoolId: 'USER_POOL_ID_test',
          ClientId: 'CLIENT_ID_test',
          AuthParameters:
                    {
                      USERNAME: 'ca710a4e-0f7c-4845-ad6c-29dc07063bab',
                      PASSWORD: 'Password@123',
                    },
        },

      ],
    ]);
    expect(res.status.mock.calls).toEqual([]);
    expect(res.status().json.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'internal_server_error',
        500,
        'Server_Error',
        500,
      ],
    ]);
  });

});