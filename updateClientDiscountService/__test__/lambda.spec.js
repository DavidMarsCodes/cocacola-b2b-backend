const handlerClientDiscount = require('../lambda');

describe('updateClientDiscount lambda Function', () => {
    it('Request the data of postLock', async () => {

        const experts = {
            clientDiscount: {
                validateClientDiscountData: jest.fn().mockReturnValue({
                    cpgId: '001',
                    countryId: 'CL',
                    clientId: 1,
                    organizationId: '3043',
                    clientDiscounts: [
                        {
                            discountId: 573,
                            active: true,
                            motive: 'this is a motive',
                        }
                    ],

                }),
                validateExistsResult: jest.fn(),
                handlersDatabaseError: jest.fn().mockReturnValue({
                    getData: jest.fn().mockReturnValue({
                        httpStatus: 400,
                        status: 'error',
                        code: 500,
                        msg: 'Validation error.The received value does not meet a unique constraint in the database.',
                        data: {
                            name: '',
                            description: '',
                            fields: []
                        }
                    })
                })
            }
        }

        const repositories = jest.fn().mockResolvedValue({
            ClientDiscount: {
                updateClientDiscount: jest.fn().mockResolvedValue({
                    cpgId: '001',
                    countryId: 'CL',
                    clientId: 1,
                    organizationId: '3043',
                    clientDiscounts: [
                        {
                            discountId: 573,
                            active: true,
                            motive: 'this is a motive',
                        }
                    ],
                })
            },
            closeConnection: jest.fn().mockResolvedValue({})
        })

        const res = {
            status: jest.fn().mockReturnValue({
                json: jest.fn().mockReturnValue(true)
            }),
            error: jest.fn().mockResolvedValue({
                "httpStatus": 404,
                "ok": true,
                "code": 1001,
                "errorType": "Not Found",
                "message": "descripcion del error"
            })
        }

        const result = await handlerClientDiscount({ repositories, experts, res }).updateClientDiscount({
            cpgId: '001',
            countryId: 'CL',
            clientId: 1,
            organizationId: '3043',
            clientDiscounts: [
                {
                    discountId: 573,
                    active: true,
                    motive: 'this is a motive',
                }
            ],
        });

        expect(experts.clientDiscount.validateClientDiscountData.mock.calls).toEqual([
            [
                {
                    cpgId: '001',
                    countryId: 'CL',
                    clientId: 1,
                    organizationId: '3043',
                    clientDiscounts: [
                        {
                            discountId: 573,
                            active: true,
                            motive: 'this is a motive',
                        }
                    ],
                }
            ]
        ]);

        const { ClientDiscount, closeConnection } = await repositories();
        expect(ClientDiscount.updateClientDiscount.mock.calls).toEqual([
            [
                {
                    cpgId: '001',
                    countryId: 'CL',
                    clientId: 1,
                    organizationId: '3043',
                    clientDiscounts: [
                        {
                            discountId: 573,
                            active: true,
                            motive: 'this is a motive',
                        }
                    ],
                }
            ]
        ]);
        expect(experts.clientDiscount.validateExistsResult.mock.calls).toEqual([
            [
                {
                    cpgId: '001',
                    countryId: 'CL',
                    clientId: 1,
                    organizationId: '3043',
                    clientDiscounts: [
                        {
                            discountId: 573,
                            active: true,
                            motive: 'this is a motive',
                        }
                    ],
                }
            ]
        ])
        expect(res.status.mock.calls).toEqual([
            [
                201
            ]
        ]);
        expect(res.status().json.mock.calls).toEqual([
            [
                {
                    cpgId: '001',
                    countryId: 'CL',
                    clientId: 1,
                    organizationId: '3043',
                    clientDiscounts: [
                        {
                            discountId: 573,
                            active: true,
                            motive: 'this is a motive',
                        }
                    ],
                }
            ]
        ]);
        expect(result).toEqual(true);

        expect(closeConnection.mock.calls).toEqual([[]]);


    });

    it('It should return a error, this error is not a handled error.', async () => {
        const experts = {
            clientDiscount: {
                validateClientDiscountData: jest.fn(() => {
                    throw {
                        customError: true,
                        getData: jest.fn().mockReturnValue({
                            httpStatus: 400,
                            status: 'error',
                            code: 100,
                            msg: 'Validation_server_error',
                            type: 'Validation_error'
                        })
                    }
                }),
                validateExistsResult: jest.fn(),
                handlersDatabaseError: jest.fn().mockReturnValue({
                    getData: jest.fn().mockReturnValue({
                        httpStatus: 400,
                        status: 'error',
                        code: 500,
                        msg: 'Validation error.The received value does not meet a unique constraint in the database.',
                        data: {
                            name: '',
                            description: '',
                            fields: []
                        }
                    })
                })
            }
        }

        const repositories = jest.fn().mockResolvedValue({
            ClientDiscount: {
                updateClientDiscount: jest.fn().mockResolvedValue({
                    cpgId: '001',
                    countryId: 'CL',
                    clientId: 1,
                    organizationId: '3043',
                    clientDiscounts: [
                        {
                            discountId: 573,
                            active: true,
                            motive: 'this is a motive',
                        }
                    ],
                })
            },
            closeConnection: jest.fn().mockResolvedValue({})
        })

        const res = {
            status: jest.fn().mockReturnValue({
                json: jest.fn().mockReturnValue(true)
            }),
            error: jest.fn().mockResolvedValue({
                "httpStatus": 404,
                "ok": true,
                "code": 1001,
                "errorType": "Not Found",
                "message": "descripcion del error"
            })
        }

        const result = await handlerClientDiscount({ repositories, experts, res }).updateClientDiscount({
            cpgId: '001',
            countryId: 'CL',
            clientId: 1,
            organizationId: '3043',
            clientDiscounts: [
                {
                    discountId: 573,
                    active: true,
                    motive: 'this is a motive',
                }
            ],
        });

        expect(experts.clientDiscount.validateClientDiscountData.mock.calls).toEqual([
            [
                {
                    cpgId: '001',
                    countryId: 'CL',
                    clientId: 1,
                    organizationId: '3043',
                    clientDiscounts: [
                        {
                            discountId: 573,
                            active: true,
                            motive: 'this is a motive',
                        }
                    ],
                }
            ]
        ]);

        const { ClientDiscount, closeConnection } = await repositories();
        expect(ClientDiscount.updateClientDiscount.mock.calls).toEqual([]);
        expect(experts.clientDiscount.validateExistsResult.mock.calls).toEqual([]);
        expect(res.status.mock.calls).toEqual([]);
        expect(res.error.mock.calls).toEqual([
            [
                "Validation_server_error",
                100,
                "Validation_error",
                400
            ]
        ])
        expect(result).toEqual({
            "httpStatus": 404,
            "ok": true,
            "code": 1001,
            "errorType": "Not Found",
            "message": "descripcion del error"
        });

        expect(closeConnection.mock.calls).toEqual([[]]);
    });

    it('It should return a error, this error is not a handled error.', async () => {
        const experts = {
            clientDiscount: {
                validateClientDiscountData: jest.fn().mockReturnValue({
                    cpgId: '001',
                    countryId: 'CL',
                    clientId: 1,
                    organizationId: '3043',
                    clientDiscounts: [
                        {
                            discountId: 573,
                            active: true,
                            motive: 'this is a motive',
                        }
                    ],
                }),
                validateExistsResult: jest.fn(),
                handlersDatabaseError: jest.fn().mockReturnValue({
                    getData: jest.fn().mockReturnValue({
                        httpStatus: 400,
                        status: 'error',
                        code: 500,
                        msg: 'Validation error.The received value does not meet a unique constraint in the database.',
                        type: 'Server_Error',
                        meta: {
                            name: '',
                            description: '',
                            fields: []
                        }
                    })
                })
            }
        }

        const repositories = jest.fn().mockResolvedValue({
            ClientDiscount: {
                updateClientDiscount: jest.fn().mockRejectedValue({})
            },
            closeConnection: jest.fn().mockResolvedValue({})
        })

        const res = {
            status: jest.fn().mockReturnValue({
                json: jest.fn().mockReturnValue(true)
            }),
            error: jest.fn().mockResolvedValue({
                "httpStatus": 404,
                "ok": true,
                "code": 1001,
                "errorType": "Not Found",
                "message": "descripcion del error"
            })
        }

        const result = await handlerClientDiscount({ repositories, experts, res }).updateClientDiscount({
            cpgId: '001',
            countryId: 'CL',
            clientId: 1,
            organizationId: '3043',
            clientDiscounts: [
                {
                    discountId: 573,
                    active: true,
                    motive: 'this is a motive',
                }
            ],
        });

        expect(experts.clientDiscount.validateClientDiscountData.mock.calls).toEqual([
            [
                {
                    cpgId: '001',
                    countryId: 'CL',
                    clientId: 1,
                    organizationId: '3043',
                    clientDiscounts: [
                        {
                            discountId: 573,
                            active: true,
                            motive: 'this is a motive',
                        }
                    ],
                }
            ]
        ]);

        const { ClientDiscount, closeConnection } = await repositories();
        expect(ClientDiscount.updateClientDiscount.mock.calls).toEqual([
            [
                {
                    cpgId: '001',
                    countryId: 'CL',
                    clientId: 1,
                    organizationId: '3043',
                    clientDiscounts: [
                        {
                            discountId: 573,
                            active: true,
                            motive: 'this is a motive',
                        }
                    ],
                }
            ]
        ]);
        expect(experts.clientDiscount.validateExistsResult.mock.calls).toEqual([]);
        expect(experts.clientDiscount.handlersDatabaseError).toHaveBeenCalled();
        expect(res.error.mock.calls).toEqual([
            [
                'Validation error.The received value does not meet a unique constraint in the database.',
                500,
                'Server_Error',
                400,
                {
                    name: '',
                    description: '',
                    fields: []
                }
            ]
        ])
        expect(res.status.mock.calls).toEqual([]);
        expect(result).toEqual({
            "httpStatus": 404,
            "ok": true,
            "code": 1001,
            "errorType": "Not Found",
            "message": "descripcion del error"
        });

        expect(closeConnection.mock.calls).toEqual([[]]);

    });
});