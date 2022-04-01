module.exports = async (hasRedisItems) => {

  if (!hasRedisItems.items) {
    return;
  }

  const subTotalBySegments = hasRedisItems.items.map((item) => ({ subTotal: item.totals.finalPrice, segmentId: item.segmentId }));

  const accumulatedBySegments = [];

  // accumulate subtotals if segment is repeated
  subTotalBySegments.reduce((res, value) => {
    if (!res[value.segmentId]) {
      res[value.segmentId] = { segmentId: value.segmentId, subTotal: 0 };
      accumulatedBySegments.push(res[value.segmentId]);
    }
    res[value.segmentId].subTotal += value.subTotal;
    return res;
  }, {});

  return accumulatedBySegments;

};