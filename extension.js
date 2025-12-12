const {
  handleDocumentChange,
} = require("./helpers/handleDocumentContentErase");
const { clearHighlightsInCurrentFile } = require("./helpers/clearHighlights");
const { removeHighlightForRange } = require("./helpers/removeHighlight");
const { highlightSelection } = require("./helpers/highlightSelection");
const { restoreHighlights } = require("./helpers/restoreHighlight");
const {  hexToRgb } = require("./helpers/handy_functions");
const { showColorPicker } = require("./helpers/colorPicker");
const { updateHighlightData } = require("./helpers/updateHighlightData");
const { clearAllHighlights } = require("./helpers/clearAllHighlights")

const vscode = require("vscode");

function activate(context) {
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    const fileUri = activeEditor.document.uri.toString();
    restoreHighlights(context, activeEditor, fileUri);
  }
  const docChangeDisposable = vscode.workspace.onDidChangeTextDocument(
    (event) => {
      handleDocumentChange(event, context);
    }
  );

  vscode.workspace.onDidOpenTextDocument((doc) => {
    const fileUri = doc.uri.toString();
    const editor = vscode.window.visibleTextEditors.find(
      (e) => e.document.uri.toString() === fileUri
    );
    if (editor) {
      restoreHighlights(context, editor, fileUri);
    }
  });

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      const fileUri = editor.document.uri.toString();
      restoreHighlights(context, editor, fileUri);
    }
  });

  let clearCurrentFileHighlightsDisposable = vscode.commands.registerCommand(
    "extension.clearAllHiglightsInCurrentFile",
    () => {
      clearHighlightsInCurrentFile(context);
    }
  );

  let clearAllHighlightsDisposable = vscode.commands.registerCommand(
    "extension.clearAllHighlights",
    () => {
      clearAllHighlights(context);
    }
  );

  let highlightTextDisposable = vscode.commands.registerCommand(
    "extension.highlightText",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selectionRange = editor.selection;
        const fileUri = editor.document.uri.toString();

        if (!selectionRange.isEmpty) {
          let highlightColor = context.workspaceState.get(
            "highlightColor",
            "#FFFF00"
          );
          if (highlightColor.startsWith("#")) {
            highlightColor = hexToRgb(highlightColor);
          }

          highlightSelection(editor, selectionRange, highlightColor);
          updateHighlightData(context, fileUri, selectionRange, highlightColor);
        } else {
          vscode.window.showWarningMessage(
            "No text selected to highlight!"
          );
        }
      }
    }
  );

  let clearSelectedHighlightDisposable = vscode.commands.registerCommand(
    "extension.clearHighlightForSelectedRange",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No active editor to clear highlights from.");
        return;
      }
      const selectionRange = editor.selection;
      if (selectionRange.isEmpty) {
        vscode.window.showInformationMessage("Select a highlighted range to clear.");
        return;
      }
      const fileUri = editor.document.uri.toString();
      removeHighlightForRange(context, editor, fileUri, selectionRange);
    }
  );

  let selectColorDisposable = vscode.commands.registerCommand(
    "extension.selectHighlightColor",
    () => {
      showColorPicker(context);
    }
  );

  context.subscriptions.push(
    highlightTextDisposable,
    clearSelectedHighlightDisposable,
    selectColorDisposable,
    clearCurrentFileHighlightsDisposable,
    docChangeDisposable,
    clearAllHighlightsDisposable
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
