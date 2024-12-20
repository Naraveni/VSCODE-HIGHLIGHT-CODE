const vscode = require('vscode');

// Key to store highlights in workspaceState
const highlightKey = 'highlightedRanges';

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  // Listen for document opening
  vscode.workspace.onDidOpenTextDocument(doc => {
    console.log("onDidOpenTextDocument triggered for: " + doc.uri.toString());
    const fileUri = doc.uri.toString();
    const editor = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === fileUri);
    if (editor) {
      restoreHighlights(context, editor, fileUri);
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


  // Registering highlight text command
  let highlightTextDisposable = vscode.commands.registerCommand('extension.highlightText', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selectionRange = editor.selection;
      const fileUri = editor.document.uri.toString();

      if (!selectionRange.isEmpty) {
        let highlightColor = context.workspaceState.get('highlightColor', '#FFFF00');
        if (highlightColor.startsWith('#')) {
          // Convert hex to rgba with opacity
          highlightColor = hexToRgb(highlightColor);
        }

        // Highlight the selected text and store it
        highlightSelection(editor, selectionRange, highlightColor);
        updateHighlightData(context, fileUri, selectionRange, highlightColor);
      } else {
        vscode.window.showInformationMessage('No text selected to highlight!');
      }
    }
  });

  // Registering color selection command
  let selectColorDisposable = vscode.commands.registerCommand('extension.selectHighlightColor', () => {
    showColorPicker(context);
  });

  context.subscriptions.push(highlightTextDisposable, selectColorDisposable);
}

// Function to convert hex to rgba
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.7)`; // Set opacity to 70%
}

// Function to highlight selected text
function highlightSelection(editor, range, color) {
  const decorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: color,
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

// Show color picker for highlight selection
function showColorPicker(context) {
  const colorObject = {
    Yellow: '#FFFF00',
    Red: '#FF0000',
    Green: '#00FF00',
    Blue: '#0000FF',
    Magenta: '#FF00FF',
    Cyan: '#00FFFF',
    Orange: '#FFA500',
    Purple: '#800080',
    Gray: '#808080',
    'Dark Green': '#008000',
    Maroon: '#800000',
    Olive: '#808000',
    'Steel Blue': '#4682B4',
    Chocolate: '#D2691E',
    Teal: '#5F9EA0',
    Lime: '#7FFF00',
    Crimson: '#DC143C',
    'Dark Orange': '#FF8C00',
    'Dark Orchid': '#9932CC',
    Gold: '#FFD700'
  };

  const colorOptions = Object.keys(colorObject).map(colorName => ({
    label: colorName,
    colorCode: colorObject[colorName]
  }));

  vscode.window.showQuickPick(colorOptions, {
    placeHolder: 'Select a highlight color',
    canPickMany: false,
  }).then(selectedColor => {
    if (selectedColor) {
      context.workspaceState.update('highlightColor', selectedColor.colorCode);
      vscode.window.showInformationMessage(`Highlight color set to ${selectedColor.colorCode}`);
    }
  });
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
