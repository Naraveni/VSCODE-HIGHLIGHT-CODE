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
const vscode = require("vscode");

function activate(context) {
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    const fileUri = activeEditor.document.uri.toString();
    restoreHighlights(context, activeEditor, fileUri);
  }
  vscode.window.onDidChangeTextEditorSelection((event) => {
    const editor = event.textEditor;
    const selectionRange = editor.selection;
    if (!selectionRange.isEmpty) {
      const fileUri = editor.document.uri.toString();
      removeHighlightForRange(context, editor, fileUri, selectionRange);
    }
  });
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
    "extension.clearAllHighlights",
    () => {
      clearHighlightsInCurrentFile(context);
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
          vscode.window.showInformationMessage(
            "No text selected to highlight!"
          );
        }
      }
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
    selectColorDisposable,
    clearCurrentFileHighlightsDisposable,
    docChangeDisposable
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
