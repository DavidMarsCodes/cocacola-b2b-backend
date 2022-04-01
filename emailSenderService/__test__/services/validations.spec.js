const { statesEnabled } = require('../../services/validations');

describe('Validations', () => {
  it('Validations should be true', () => {
    const templateData = { status: 'CREATED' };

    const res = statesEnabled(templateData);

    expect(res).toEqual(true);
  });

  it('Validations should be false', () => {
    const templateData = { status: 'string' };

    const res = statesEnabled(templateData);

    expect(res).toEqual(false);
  });
});
