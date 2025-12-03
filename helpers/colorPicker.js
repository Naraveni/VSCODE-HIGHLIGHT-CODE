const vscode = require('vscode');
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

module.exports = { showColorPicker}