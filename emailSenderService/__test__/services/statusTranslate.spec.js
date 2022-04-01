const statesTranslate = require('../../services/statusTranslate');

describe('statesTranslate', () => {
  it('It should translate state', () => {
    const templateData = { status: 'CREATED' };

    const res = statesTranslate(templateData);

    expect(res).toEqual('Ingresado');
  });

  it('It should translate state', () => {
    const templateData = { status: 'TRANSIT' };

    const res = statesTranslate(templateData);

    expect(res).toEqual('En tránsito');
  });

  it('It should translate state', () => {
    const templateData = { status: 'DELIVERED_CLT' };

    const res = statesTranslate(templateData);

    expect(res).toEqual('Entregado');
  });

  it('It should translate state', () => {
    const templateData = { status: 'RETURNED' };

    const res = statesTranslate(templateData);

    expect(res).toEqual('Retornado');
  });

  it('It should translate state', () => {
    const templateData = { status: 'BLOCKED' };

    const res = statesTranslate(templateData);

    expect(res).toEqual('Bloqueado');
  });

  it('It should translate state', () => {
    const templateData = { status: 'CANCELLED' };

    const res = statesTranslate(templateData);

    expect(res).toEqual('Cancelado');
  });
});


