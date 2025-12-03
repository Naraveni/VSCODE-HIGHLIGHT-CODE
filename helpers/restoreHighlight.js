
const {highlightKey}  =  require('../shared')
const { getRangeKey, rangesEqual } = require('./handy_functions')
const vscode = require('vscode');
const { highlightSelection } = require('./highlightSelection')


function restoreHighlights(context, editor, fileUri) {
  
  const highlights = context.workspaceState.get(highlightKey, {});
  const rangesToHighlight = highlights[fileUri] || [];
   const documentText = editor.document.getText();

  
    
  rangesToHighlight.forEach(rangeData => {
    if (!rangeData.text || !documentText.includes(rangeData.text)) {
      return;
    }
    const range = new vscode.Range(
      new vscode.Position(rangeData.start.line, rangeData.start.character),
      new vscode.Position(rangeData.end.line, rangeData.end.character)
    );
    highlightSelection(editor, range, rangeData.color);
  });
}

module.exports = { restoreHighlights}