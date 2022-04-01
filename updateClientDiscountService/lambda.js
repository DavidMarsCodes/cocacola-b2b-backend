module.exports = ({repositories, experts, res}) => ({

    updateClientDiscount: async (event) => {
            const { ClientDiscount, closeConnection } = await repositories();
        try {

            experts.clientDiscount.validateClientDiscountData(event);

            const data = await ClientDiscount.updateClientDiscount(event);

            experts.clientDiscount.validateExistsResult(data);

            return res.status(201).json(data);

        } catch (e) {
            let error;
            if (e.customError) {
                error = e.getData();
                return res.error(error.msg, error.code, error.type, error.httpStatus);
            }
            const err = experts.clientDiscount.handlersDatabaseError(e);
            error = err.getData();
            return res.error(error.msg, error.code, error.type, error.httpStatus, error.meta);
        } finally {
            await closeConnection();
        }
        
    }
})