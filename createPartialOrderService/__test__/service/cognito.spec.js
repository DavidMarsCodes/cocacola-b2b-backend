const Cognito = require('../../services/cognito');

describe('Cognito Class', () => {
  it('Validate that an instance of the Cognito class exists.', () => {
    const cognito = new Cognito();

    expect(cognito).toBeTruthy();
    expect(cognito).toBeInstanceOf(Cognito);
  });

  it('Validate the functionality of the method setIdentityConfig.', () => {
    const cognito = new Cognito();
    const clientId = 'my-clientId';
    const userPoolId = 'my-userPoolId';
    cognito.setIdentityConfig(clientId, userPoolId);

    expect(cognito.getIdentityConfig).toEqual({
      ClientId: 'my-clientId',
      UserPoolId: 'my-userPoolId',
    });
  });

  it('validate the functionality of the method getUserPoolId.', () => {
    const cognito = new Cognito();
    const urlCognito = 'https://cognito.com/0242ac130003';

    const userPoolId = cognito.getUserPoolId(urlCognito);

    expect(userPoolId).toEqual('0242ac130003');
  });

  it('Validate the functionality of the method getApplicationClientName.', () => {
    process.env.AWS_REGION = 'us-east-1';
    const cognito = new Cognito();
    const spyCongnitoService = jest.spyOn(cognito.getCognitoInstace, 'describeUserPoolClient');

    const clientId = 'my-clientId';
    const userPoolId = 'my-userPoolId';
    cognito.setIdentityConfig(clientId, userPoolId);

    cognito.getApplicationClientName();

    expect(spyCongnitoService).toHaveBeenCalledWith({
      ClientId: 'my-clientId',
      UserPoolId: 'my-userPoolId',
    });
  });

});