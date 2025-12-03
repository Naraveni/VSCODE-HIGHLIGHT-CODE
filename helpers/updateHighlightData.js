const {highlightKey}  =  require('../shared')
const { getRangeKey, rangesEqual } = require('./handy_functions')
const vscode = require('vscode');
function updateHighlightData(context, fileUri, range, color) {
  const editor = vscode.window.activeTextEditor;
  const selectedText = editor.document.getText(range);
  const highlights = context.workspaceState.get(highlightKey, {});
  if (!highlights[fileUri]) {
    highlights[fileUri] = [];
  }

  const rangeObject = {
    text: selectedText,
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