module.exports = ({ repositories, experts, awsS3, res }) => ({

  updateDiscountImageBatchService: async event => {

    let Discount;
    let closeConnection;

    try {
      ({ Discount, closeConnection } = await repositories());

      const s3Manager = await awsS3.init();

      let discounts = await Discount.getAllNotImage();
      discounts = experts.discount.buildImageName(discounts);

      let discountsWithImage = await Promise.all(discounts.map(async discount => {
        const images = await s3Manager.getAllImages(discount.imageName);
        const image = experts.discount.validateLastImage(images);
        if (!image)
          return console.warn(`DISCOUNT_WITHOUT_IMAGE: `, discount);

        const imageUrl = experts.discount.buildImageUrl(image);
        discount = experts.discount.setImageData(discount, imageUrl);
        return discount;
      }));

      discountsWithImage = experts.discount.filter(discountsWithImage);

      await Discount.updateAllImages(discountsWithImage);

    } catch (e) {
      console.error(e);
    } finally {
      await closeConnection();
    }
  },

});