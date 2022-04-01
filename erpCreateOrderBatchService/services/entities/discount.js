class Discount {

    orderId
    erpProductId
    erpDiscountclassID
    erpDiscountId
    discountType
    valDiscount

    constructor(orderId, discount) {
      this.orderId = orderId;
      this.erpProductId = discount.erpProductId;
      this.erpDiscountclassID = discount.erpDiscountClassId;
      this.erpDiscountId = discount.erpDiscountId;
      this.discountType = discount.discountType;
      this.valDiscount = discount.discountValue;
    }
}

module.exports = Discount;