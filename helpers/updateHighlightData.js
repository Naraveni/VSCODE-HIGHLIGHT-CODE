const {highlightKey}  =  require('../shared')
const { rangesEqual } = require('./handy_functions')
function updateHighlightData(context, fileUri, range, color) {
  const highlights = context.workspaceState.get(highlightKey, {});
  if (!highlights[fileUri]) {
    highlights[fileUri] = [];
  }

  const rangeObject = {
    start: { line: range.start.line, character: range.start.character },
    end: { line: range.end.line, character: range.end.character },
    color: color
  };
  if (!highlights[fileUri].some(existingRange =>
    rangesEqual(existingRange, rangeObject)
  )) {    
    highlights[fileUri].push(rangeObject);
  }

  context.workspaceState.update(highlightKey, highlights);
}

module.exports = { updateHighlightData }