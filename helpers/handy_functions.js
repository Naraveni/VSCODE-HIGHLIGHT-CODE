

function getRangeKey(range) {
  return `${range.start.line}:${range.start.character}-${range.end.line}:${range.end.character}`;
}


function rangesEqual(range1, range2) {
  return range1.start.line === range2.start.line &&
    range1.start.character === range2.start.character &&
    range1.end.line === range2.end.line &&
    range1.end.character === range2.end.character;
}

function checkCompleteOverlap(range1, range2) {
  const startsBeforeOrAt =
    range2.start.line < range1.start.line ||
    (range2.start.line === range1.start.line &&
      range2.start.character <= range1.start.character);

  const endsAfterOrAt =
    range2.end.line > range1.end.line ||
    (range2.end.line === range1.end.line &&
      range2.end.character >= range1.end.character);

  return startsBeforeOrAt && endsAfterOrAt;
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.7)`; 

}



module.exports = { getRangeKey, rangesEqual, hexToRgb, checkCompleteOverlap}