const vscode = require('vscode');

// Key to store highlights in workspaceState
const highlightKey = 'highlightedRanges';
const decorationTypes = new Map(); // Map to track decorations

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Listen for selection changes and allow highlight removal live
  vscode.window.onDidChangeTextEditorSelection(event => {
    const editor = event.textEditor;
    const selectionRange = editor.selection;

    if (!selectionRange.isEmpty) {
      const fileUri = editor.document.uri.toString();
      removeHighlightForRange(context, editor, fileUri, selectionRange);
    }
  });

  // Restore highlights on editor activation or file opening
  vscode.workspace.onDidOpenTextDocument(doc => {
    const fileUri = doc.uri.toString();
    const editor = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === fileUri);
    if (editor) {
      restoreHighlights(context, editor, fileUri);
    }
  });

  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor) {
      const fileUri = editor.document.uri.toString();
      restoreHighlights(context, editor, fileUri);
    }
  });

  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    const fileUri = activeEditor.document.uri.toString();
    restoreHighlights(context, activeEditor, fileUri);
  }

  // Register command to highlight text
  let highlightTextDisposable = vscode.commands.registerCommand('extension.highlightText', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selectionRange = editor.selection;
      const fileUri = editor.document.uri.toString();

      if (!selectionRange.isEmpty) {
        let highlightColor = context.workspaceState.get('highlightColor', '#FFFF00');
        if (highlightColor.startsWith('#')) {
          highlightColor = hexToRgb(highlightColor);
        }

        highlightSelection(editor, selectionRange, highlightColor);
        updateHighlightData(context, fileUri, selectionRange, highlightColor);
      } else {
        vscode.window.showInformationMessage('No text selected to highlight!');
      }
    }
  });

  // Register command to select a highlight color
  let selectColorDisposable = vscode.commands.registerCommand('extension.selectHighlightColor', () => {
    showColorPicker(context);
  });

  context.subscriptions.push(
    highlightTextDisposable,
    selectColorDisposable
  );
}

// Function to highlight selected text
function highlightSelection(editor, range, color) {
  const decorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: color,
    fontStyle: "italic",
    fontWeight: 'bold',
    light: {
      // this color will be used in light color themes
      color: "black",
  },
  dark: {
      // this color will be used in dark color themes
      color: "white",
  }
    
  });

  editor.setDecorations(decorationType, [range]);
  const rangeKey = getRangeKey(range);
  decorationTypes.set(rangeKey, decorationType); // Track the decoration type
}

// Function to remove a highlight for a selected range
function removeHighlightForRange(context, editor, fileUri, range) {
  const rangeKey = getRangeKey(range);
  const highlights = context.workspaceState.get(highlightKey, {});

  // Remove the decoration
  if (decorationTypes.has(rangeKey)) {
    const decorationType = decorationTypes.get(rangeKey);
    editor.setDecorations(decorationType, []); // Clear the decoration for this range
    decorationTypes.delete(rangeKey);
  }

  // Remove from workspaceState if it exists
  if (highlights[fileUri]) {
    highlights[fileUri] = highlights[fileUri].filter(existingRange =>
      !rangesEqual(existingRange, range)
    );
    context.workspaceState.update(highlightKey, highlights);
  }
}

// Helper to restore highlights for an editor
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

// Helper to convert a range to a unique key
function getRangeKey(range) {
  return `${range.start.line}:${range.start.character}-${range.end.line}:${range.end.character}`;
}

// Function to update highlight data in workspace state
function updateHighlightData(context, fileUri, range, color) {
  const highlights = context.workspaceState.get(highlightKey, {});
  if (!highlights[fileUri]) {
    highlights[fileUri] = [];
  }

  const rangeObject = {
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

// Helper to compare two ranges
function rangesEqual(range1, range2) {
  return range1.start.line === range2.start.line &&
    range1.start.character === range2.start.character &&
    range1.end.line === range2.end.line &&
    range1.end.character === range2.end.character;
}

// Function to convert hex color to rgba
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.7)`; // Set opacity to 70%
}

// Function to show a color picker
function showColorPicker(context) {
  const colors = {
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

  const colorOptions = Object.keys(colors).map(name => ({
    label: name,
    colorCode: colors[name]
  }));

  vscode.window.showQuickPick(colorOptions, {
    placeHolder: 'Select a highlight color',
    canPickMany: false
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
