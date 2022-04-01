class Filter {
    #filter

    constructor() {
      this.#filter = {};
    }

    brandsMap(brandsData) {
      const brands = brandsData.map(brand => brand.key);

      this.#filter.brands = brands;
      return this;
    }

    sizesMap(sizesData) {
      const sizes = sizesData.map(size => size.key);

      this.#filter.sizes = sizes;
      return this;
    }

    packagesMap(packagesData) {
      const packages = packagesData.map(packageItem => packageItem.key);

      this.#filter.packages = packages;
      return this;
    }

    categoriesMap(categoriesData) {
      const categories = categoriesData.map(category => category.key);

      this.#filter.categories = categories;
      return this;
    }

    returnabilityMap(returnabilitiesData) {
      const returnabilities = {
        hasReturnable: false,
        hasDisposable: false,
      };

      returnabilitiesData.forEach(retornability => {
        if (retornability.key === 0 && retornability.doc_count > 0)
          returnabilities.hasDisposable = true;


        if (retornability.key === 1 && retornability.doc_count > 0)
          returnabilities.hasReturnable = true;


      });

      this.#filter.returnabilities = returnabilities;
      return this;
    }

    getFilter() {
      return this.#filter;
    }
}

module.exports = Filter;