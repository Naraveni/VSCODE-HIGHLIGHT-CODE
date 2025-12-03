
const vscode = require('vscode');
const {highlightKey, decorationTypes}  =  require('../shared')
function clearHighlightsInCurrentFile(context) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage('No active editor to clear highlights from.');
    return;
  }
  const fileUri = editor.document.uri.toString();
  for (const [, decorationType] of decorationTypes) {
    editor.setDecorations(decorationType, []);
  }
  const highlights = context.workspaceState.get(highlightKey, {});
  if (highlights[fileUri]) {
    delete highlights[fileUri];
    context.workspaceState.update(highlightKey, highlights);
  }

  vscode.window.showInformationMessage('Cleared all highlights in current file.');
}


module.exports = {clearHighlightsInCurrentFile}