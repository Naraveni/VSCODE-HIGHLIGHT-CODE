const {highlightKey, decorationTypes}  =  require('../shared')
const { getRangeKey, rangesEqual } = require('./handy_functions')
function removeHighlightForRange(context, editor, fileUri, range) {
  const rangeKey = getRangeKey(range);
  const highlights = context.workspaceState.get(highlightKey, {});

  

  if (decorationTypes.has(rangeKey)) {
    const decorationType = decorationTypes.get(rangeKey);
    editor.setDecorations(decorationType, []);
    decorationTypes.delete(rangeKey);
  }

  

  if (highlights[fileUri]) {
    highlights[fileUri] = highlights[fileUri].filter(existingRange =>
      !rangesEqual(existingRange, range)
    );
    context.workspaceState.update(highlightKey, highlights);
  }
}

module.exports = { removeHighlightForRange }