module.exports = ({ repositories, experts, awsS3, res }) => ({

  updateProductImageBatchService: async event => {

    let Product;
    let closeConnection;

    try {
      ({ Product, closeConnection } = await repositories());
      const s3Manager = await awsS3.init();

      let products = await Product.getAllNotImage();
      products = experts.product.buildImageName(products);

      let productsWithImage = await Promise.all(products.map(async product => {
        const images = await s3Manager.getAllImages(product.imageName);
        const image = experts.product.validateLastImage(images);

        if (!image) return console.warn(`PRODUCT_WITHOUT_IMAGE: `, product);

        const imageUrl = experts.product.buildImageUrl(image);
        product = experts.product.setImageData(product, imageUrl);
        return product;
      }));

      productsWithImage = experts.product.filter(productsWithImage);

      await Product.updateAllImages(productsWithImage);
    } catch (e) {
      console.error(e);
    } finally {
      await closeConnection();
    }
  },

});