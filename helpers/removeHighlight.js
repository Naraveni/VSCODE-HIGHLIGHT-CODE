const {highlightKey, decorationTypes}  =  require('../shared')
const { getRangeKey, checkCompleteOverlap } = require('./handy_functions')
function removeHighlightForRange(context, editor, fileUri, range) {
  const rangeKey = getRangeKey(range);
  const highlights = context.workspaceState.get(highlightKey, {});

  if (decorationTypes.has(rangeKey)) {
    const decorationType = decorationTypes.get(rangeKey);
    editor.setDecorations(decorationType, []);
    decorationTypes.delete(rangeKey);
  }
  if (highlights[fileUri]) {
    highlights[fileUri] = highlights[fileUri].filter(existingRange => {
      if (checkCompleteOverlap(existingRange, range)) {
        const rangeKey = getRangeKey(existingRange);
        const decorationType = decorationTypes.get(rangeKey);
        if (decorationType) {
          editor.setDecorations(decorationType, []);
          decorationTypes.delete(rangeKey);
        }
        return false;
      }
      return true;
    });
    context.workspaceState.update(highlightKey, highlights);
  }
}

module.exports = { removeHighlightForRange }
