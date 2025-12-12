
const vscode = require('vscode');
const {highlightKey, decorationTypes}  =  require('../shared')
function clearAllHighlights(context) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No active editor to clear highlights from.');
    return;
  }
  for (const [, decorationType] of decorationTypes) {
    editor.setDecorations(decorationType, []);
  }
  const highlights = context.workspaceState.get(highlightKey, {});
  
  if (highlights) {
    context.workspaceState.update(highlightKey, {});
    vscode.window.showInformationMessage('All Highlights Removed');
  }
  else{
    vscode.window.showWarningMessage('No Highlights Found');
  }
}


module.exports = {clearAllHighlights}