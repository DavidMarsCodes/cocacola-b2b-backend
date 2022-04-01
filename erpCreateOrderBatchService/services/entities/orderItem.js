class OrderItem {

    erpProductId
    quantity

    constructor(orderItem) {
      this.erpProductId = orderItem.erpProductId;
      this.quantity = orderItem.quantity;
    }

}

module.exports = OrderItem;