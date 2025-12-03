const { decorationTypes}  =  require('../shared')
const { getRangeKey } = require('./handy_functions')
const vscode = require('vscode');
function highlightSelection(editor, range, color) {
  const decorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: color,
    fontStyle: "italic",
    fontWeight: 'bold',
    light: {
      
      

      color: "black",
  },
  dark: {
      
    
      color: "white",
  }
    
  });

  editor.setDecorations(decorationType, [range]);
  const rangeKey = getRangeKey(range);
  decorationTypes.set(rangeKey, decorationType); 

}

module.exports = { highlightSelection}