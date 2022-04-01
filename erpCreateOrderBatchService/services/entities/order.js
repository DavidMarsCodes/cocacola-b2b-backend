class Order {

    orderId
    orderDeliveryDate
    orderDelivery
    organizationId
    createdBy
    orderDatetime
    requireErpConvertion
    erpClientId
    sourceChannel
    items
    discount

    constructor(order, orderItems, discounts, orderDelivery) {
      this.orderId = order.orderId;
      this.orderDeliveryDate = order.orderDeliveryDate;
      this.orderDelivery = orderDelivery;
      this.organizationId = order.organizationId;
      this.createdBy = order.createdBy;
      this.orderDatetime = order.orderDatetime;
      this.requireErpConvertion = order.requireErpConvertion;
      this.erpClientId = order.erpClientId;
      this.sourceChannel = order.sourceChannel;
      this.items = orderItems;
      this.discount = discounts;
    }
}

module.exports = Order;