const vscode = require('vscode');

// Key to store highlights in workspaceState
const highlightKey = 'highlightedRanges';

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Command to highlight the selected text
  let highlightTextDisposable = vscode.commands.registerCommand('extension.highlightText', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selectionRange = editor.selection; // Get the selected text range
      const fileUri = editor.document.uri.toString();

      if (!selectionRange.isEmpty) {
        const config = vscode.workspace.getConfiguration('highlightExtension');
        const highlightColor = config.get('highlightColor', '#FFFF00'); // Default color

        // Highlight the selected text and store it
        highlightSelection(editor, selectionRange, highlightColor);
        updateHighlightData(context, fileUri, selectionRange, highlightColor);
      } else {
        vscode.window.showInformationMessage('No text selected to highlight!');
      }
    }
  });

  // Listen for changes in active text editor
  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor) {
      const fileUri = editor.document.uri.toString();
      restoreHighlights(context, editor, fileUri);
    }
  });

  // Restore highlights for the currently active editor (on activation)
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    const fileUri = activeEditor.document.uri.toString();
    restoreHighlights(context, activeEditor, fileUri);
  }

  context.subscriptions.push(highlightTextDisposable);
}

// Function to highlight a specific selection range with a given color
function highlightSelection(editor, range, color) {
  const decorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: color,
    fontWeight: 'bold'
  });

  editor.setDecorations(decorationType, [range]);
}

// Update highlight data in workspace state
function updateHighlightData(context, fileUri, range, color) {
  const highlights = context.workspaceState.get(highlightKey, {});

  if (!highlights[fileUri]) {
    highlights[fileUri] = [];
  }

  const rangeObject = {
    start: { line: range.start.line, character: range.start.character },
    end: { line: range.end.line, character: range.end.character },
    color: color // Store color for the range
  };

  // Avoid duplicate highlights
  if (!highlights[fileUri].some(existingRange =>
    existingRange.start.line === rangeObject.start.line &&
    existingRange.start.character === rangeObject.start.character &&
    existingRange.end.line === rangeObject.end.line &&
    existingRange.end.character === rangeObject.end.character &&
    existingRange.color === rangeObject.color
  )) {
    highlights[fileUri].push(rangeObject);
  }

  context.workspaceState.update(highlightKey, highlights);
}

// Restore highlights for a given editor and file
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

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
