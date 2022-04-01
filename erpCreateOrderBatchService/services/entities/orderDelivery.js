class OrderDelivery {

    deliveryType;
    deliveryDate;

    constructor(orderDelivery) {
      this.deliveryType = orderDelivery.deliveryType;
      this.deliveryDate = orderDelivery.deliveryDate;
    }
}

module.exports = OrderDelivery;