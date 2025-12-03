const vscode = require('vscode');

const {highlightKey, decorationTypes}  =  require('../shared')
function handleDocumentChange(event, context) {
  const doc = event.document;
  const fileUri = doc.uri.toString();

  const highlights = context.workspaceState.get(highlightKey, {});
  const fileHighlights = highlights[fileUri];

  if (!fileHighlights || fileHighlights.length === 0) return;

  if (doc.getText().length === 0) {
    for (const [rangeKey, decorationType] of decorationTypes) {
      decorationTypes.delete(rangeKey);
      const editor = vscode.window.visibleTextEditors.find(
        e => e.document.uri.toString() === fileUri
      );
      if (editor) {
        editor.setDecorations(decorationType, []);
      }
    }

    delete highlights[fileUri];
    context.workspaceState.update(highlightKey, highlights);
    return;
  }
}

module.exports = { handleDocumentChange}

