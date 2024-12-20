// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */


function activate(context) {
  let highlightLineDisposable = vscode.commands.registerCommand('extension.highlightLine', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const line = editor.selection.active.line; // Get the current line number
      highlightLine(editor, line);
    }
  });

  // Add the disposables to the context
  context.subscriptions.push(highlightLineDisposable);
}

function highlightLine(editor, line) {
  const config = vscode.workspace.getConfiguration('highlightExtension');
  let highlightColor = config.get('highlightColor', '#FFFF00');
  const decorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: highlightColor, // Light yellow background
    fontWeight: 'bold'
  });

  const lineRange = editor.document.lineAt(line).range;
  editor.setDecorations(decorationType, [lineRange]);

  // Optionally, store the decoration type to dispose of it later
  // context.subscriptions.push(decorationType);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};

