
const {highlightKey}  =  require('../shared')
const vscode = require('vscode');
const { highlightSelection } = require('./highlightSelection')


function restoreHighlights(context, editor, fileUri) {
  
  const highlights = context.workspaceState.get(highlightKey, {});
  
  const rangesToHighlight = highlights[fileUri] || [];
  
    
  rangesToHighlight.forEach(rangeData => {
    const range = new vscode.Range(
      new vscode.Position(rangeData.start.line, rangeData.start.character),
      new vscode.Position(rangeData.end.line, rangeData.end.character)
    );
    highlightSelection(editor, range, rangeData.color);
  });
}

module.exports = { restoreHighlights }