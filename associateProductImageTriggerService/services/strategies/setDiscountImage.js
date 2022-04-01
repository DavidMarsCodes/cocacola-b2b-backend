module.exports = {
  set: async (experts, Discount, event) => {
    const params = experts.discount.getParamsDiscountImage(event);

    experts.discount.validationRequiredParamsDiscountImage(params);

    const imageUrl = experts.discount.getDiscountImageUrl(event);

    console.debug('Discount to associate with the image: ', { ...params, image: imageUrl });
    const result = await Discount.updateImage(params, imageUrl);
    experts.discount.validateExistsResult(result, 'DISCOUNT_IMAGE_NOT_UPDATE', { ...params, image: imageUrl });
  },
};