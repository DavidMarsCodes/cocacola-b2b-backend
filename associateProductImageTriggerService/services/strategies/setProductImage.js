module.exports = {
  set: async (experts, Product, event) => {
    const params = experts.product.getParamsProductImage(event);

    experts.product.validationRequiredParamsProductImage(params);

    const imageUrl = experts.product.getProductImageUrl(event);

    console.debug('Product to associate with the image: ', { ...params, image: imageUrl });
    const result = await Product.updateImage(params, imageUrl);

    experts.product.validateExistsResult(result, 'PRODUCT_IMAGE_NOT_UPDATE', { ...params, image: imageUrl });
  },
};