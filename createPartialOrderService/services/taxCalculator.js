const { round } = require('lodash');

const calculate = async (event, Order, taxType) => {

  const items = [];

  for (const item of event.items)
    try {

      const newItem = {
        p_productId: item.productId,
        p_clientId: event.clientId,
        p_priceBase: item.price.listPrice,
        p_shippingPrice: item.price.shippingPrice,
        p_discount: item.price.discounts,
        p_taxtype: taxType.internalTaxes,
      };

      // :p_productId,:p_clientId,:p_priceBase,:p_shippingPrice,:p_discount,:p_taxtype
      const internalTaxes = await Order.calculateInterno(newItem);

      newItem.p_impInternov = internalTaxes[0][`b2b.fn_CalculateImpInt(${newItem.p_productId},${newItem.p_clientId},${newItem.p_priceBase},${newItem.p_shippingPrice},${newItem.p_discount},"${newItem.p_taxtype}")`] || 0;
      newItem.p_taxtype = taxType.iva;

      // p_productId, p_clientId, p_priceBase, p_shippingPrice, p_discount, p_impInternov, p_taxtype
      const iva = await Order.calculateIva(newItem);

      newItem.p_iva = iva[0][`b2b.fn_CalculateIva(${newItem.p_productId},${newItem.p_clientId},${newItem.p_priceBase},${newItem.p_shippingPrice},${newItem.p_discount},${newItem.p_impInternov},"${newItem.p_taxtype}")`] || 0;
      newItem.p_taxtype = taxType.generalTaxes;

      // p_productId,:p_clientId,:p_priceBase,:p_shippingPrice,:p_discount,:p_impInternov,:p_iva,:p_taxtype
      const generalTaxes = await Order.calculateGeneralTaxes(newItem);
      const gralTaxValue = generalTaxes[0][`b2b.fn_CalculateGeneralTaxes(${newItem.p_productId},${newItem.p_clientId},${newItem.p_priceBase},${newItem.p_shippingPrice},${newItem.p_discount},${newItem.p_impInternov},${newItem.p_iva},"${newItem.p_taxtype}")`] || 0;

      const taxes = Number(newItem.p_impInternov) + Number(newItem.p_iva) + Number(gralTaxValue) || 0;
      item.price.taxes = round(taxes, 3);
      item.price.finalPrice = round(item.price.listPrice + item.price.taxes + item.price.shippingPrice - item.price.discounts, 3);
      items.push(item);

    } catch (e) {
      console.error(e);
    }


  return items;

};


module.exports = calculate;
