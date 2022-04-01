module.exports = async (availableBySegments, accumulatedBySegments) => {

  const processedList = [];

  availableBySegments.forEach((availableBySegment) => {
    const availableParsedToFloat = Math.max(0, parseFloat(availableBySegment.available));
    if (accumulatedBySegments) {
      const segmentSubTotal = accumulatedBySegments.find((x) => x.segmentId === availableBySegment.segmentId);
      const newAvailable = segmentSubTotal ? availableParsedToFloat - segmentSubTotal.subTotal : availableParsedToFloat;
      processedList.push({
        newAvailable,
        available: availableParsedToFloat,
        segmentId: availableBySegment.segmentId,
        segmentName: availableBySegment.Segment.name,
        spent: segmentSubTotal ? segmentSubTotal.subTotal : 0,
        status: newAvailable >= 0 ? 'OK' : 'FAIL',
      });
    } else {
      processedList.push({
        available: availableParsedToFloat,
        segmentId: availableBySegment.segmentId,
        segmentName: availableBySegment.Segment.name,
        newAvailable: availableParsedToFloat,
        spent: 0,
        status: 'OK',
      });
    }

  });

  const checkNonExistantCredit = accumulatedBySegments ? accumulatedBySegments.filter(({ segmentId: id1 }) => !availableBySegments.some(({ segmentId: id2 }) => id2 === id1)) : [];

  return { processedList, checkNonExistantCredit };

};