const { Discount, OrderItem, OrderDelivery, Order } = require('./entities');

class Mapper {

  /** Map the discount data to our domain entity.
     * @param  {string} orderId
     * @param  {object} discountsData
     * @returns {array} - Discount class.
     */
  static discountMap(orderId, discountsData) {

    // Validate that there are discounts to apply
    if (discountsData.length === 0) {
      return [];
    }

    // Get the items on which discounts were applied.
    const discountItems = discountsData.calculatedItems;

    // Get the discounts applied.
    const discountsApplied = discountItems.map((discountItem) => {

      // Validate schema properties.
      if (!discountItem.price || !discountItem.price.discountsApplied) {
        return [];
      }

      // Get the discounts mapped.
      return discountItem.price.discountsApplied.map((discountApplied) => ({
        erpProductId: discountItem.erpProductId,
        erpDiscountClassId: discountApplied.erpDiscountClassId,
        erpDiscountId: discountApplied.erpDiscountId,
        discountType: discountApplied.discountType,
        discountValue: discountApplied.discountAmount,
      }));
    });

    // Create discount entities.
    let discounts = [];
    discountsApplied.forEach((discountParent) => {
      const newDiscounts = discountParent.map((discount) => new Discount(orderId, discount));
      discounts = discounts.concat(newDiscounts);
    });

    return discounts;
  }

  /**
     * @param  {object} orderData
     * @returns {array} - OrderItem class.
     */
  static orderItemMap(orderData) {
    return orderData.map((order) => new OrderItem(order));
  }

  /**
     *
     * @param {object} orderDeliveryData
     * @returns {array} - OrderDelivery class.
     */
  static orderDeliveryMap(orderDeliveryData) {
    return orderDeliveryData.map((order) => new OrderDelivery(order));
  }

  /**
     * @param  {object} orderData
     * @param  {array} orderItems
     * @param  {array} discounts
     * @param  {array} orderDelivery
     * @returns {object} - Order class.
     */
  static orderMap(orderData, orderItems, discounts, orderDelivery) {
    return new Order(orderData, orderItems, discounts, orderDelivery);
  }

  /**
     * Transforms bom discounts to bom materials
     * WARNING: this is not a pure function, it edits its parameters directly
     * @param  {object} order: order
     * @param  {object} discounts: discounts
     * @returns {void}
     */
  // TODO probar el impacto en memoria de trabajar sobre una copia de los parametros y retornar la copia actualizada en vez de editarlos directamente
  static bomMap(order, discounts) {
    const orderItems = order.items;
    const bomType = 'B';

    // buscamos los descuentos BOM aplicados
    const bomDiscounts = [];
    discounts.forEach((discount) => {
      if (discount.price.discountsApplied) {
        discount.price.discountsApplied.forEach((discountApplied) => {
          if (discountApplied.discountType === bomType) {
            bomDiscounts.push(discountApplied);
          }
        });
      }
    });

    // transformamos descuentos bom en material bom
    const processedDiscounts = [];
    bomDiscounts.forEach((discount) => {
      if (!processedDiscounts.includes(discount.erpDiscountId)) {
        // quitamos materiales del BOM de la lista de materiales de la orden
        discount.requirements.forEach((requirement) => {
          const requirementProduct = orderItems.find((orderItem) => orderItem.productId === requirement.productId);
          requirementProduct.quantity -= requirement.quantity * discount.quantityApplied;
        });
        // agregamos el item BOM a la lista de materiales de la orden
        orderItems.push({
          erpProductId: discount.erpDiscountId,
          quantity: discount.quantityApplied,
        });
        // agregamos el combo BOM como ya procesado para no volver a procesarlo ni restar items de mas
        processedDiscounts.push(discount.erpDiscountId);
      }
    });

    // quitamos los descuentos BOM de la lista de descuentos aplicados porque los transformamos en materiales
    discounts.forEach((discount) => {
      if (discount.price.discountsApplied) {
        discount.price.discountsApplied = discount.price.discountsApplied.filter((discountApplied) => discountApplied.discountType !== bomType);
      }
    });

    // quitamos los items que solo eran parte de combos BOM
    order.items = orderItems.filter((orderItem) => orderItem.quantity > 0);

  }

}

module.exports = Mapper;