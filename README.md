# HIGHLIGHT CODE IN VSCODE EDITOR WITH COLORS

This VSCODE extension enables to highlight the code with different colors.

## Features

This extension provides functionality to highlight text with customizable colors in VS Code. It also allows you to manage your highlights effectively across the workspace. Below are the key features and commands included:

#### Highlight Selected Text
Easily highlight any selected text with your chosen color. The highlight remains persistent even when you reopen the file.


#### Choose a Highlight Color
Use a color picker to select your preferred highlight color from a wide range of options.


#### Remove All Highlights Across the Workspace
Remove all highlights from every file in the current workspace with a single command.



## Extension Settings

This extension provides the following commands, which can be accessed via their respective shortcuts or through the Command Palette:


### Commands and Shortcuts

This extension provides the following commands, accessible via shortcuts or the Command Palette:

| **Command**                          | **Shortcut (Mac)**    | **Shortcut (Windows/Linux)** | **Description**                                                      |
|--------------------------------------|-----------------------|------------------------------|----------------------------------------------------------------------|
| `extension.highlightText`            | `Cmd+Shift+H`         | `Ctrl+Shift+H`               | Highlights the selected text with the chosen color.                  |
| `extension.selectHighlightColor`     | `Cmd+Shift+M`         | `Ctrl+Shift+M`               | Opens a color picker to select the highlight color.                  |
| `extension.clearAllHighlightsWorkspace` | `Cmd+Shift+X`      | `Ctrl+Shift+X`               | Removes all highlights across the entire workspace.                  |


### Extension Settings

This extension contributes the following settings to your VS Code configuration:

| **Setting**                    | **Type**   | **Default**  | **Description**                                                                 |
|--------------------------------|------------|--------------|---------------------------------------------------------------------------------|
| `highlightText.enable`         | `boolean`  | `true`       | Enable or disable the text highlighting functionality of this extension.        |
| `highlightText.defaultColor`   | `string`   | `#FFFF00`    | Specify the default highlight color in hexadecimal format (e.g., `#FF0000` for red). |
| `highlightText.opacity`        | `number`   | `0.7`        | Set the opacity for highlights (range: 0 to 1).                                 |

---

### How to Update Settings

To modify these settings:

1. Open your settings file:
   - Navigate to **File > Preferences > Settings**.
   - Or use the shortcut: **Cmd+,** (Mac) / **Ctrl+,** (Windows/Linux).
   
2. Search for the desired setting (e.g., `highlightText.defaultColor`).

3. Update its value based on your preferences.

For example, to change the default highlight color to red, update the setting:

```json
"highlightText.defaultColor": "#FF0000"
```




## Release Notes

Includes Only Highlighting code, Color Selection & Clearing All The Highlighted Code

### 1.0.0

Base Extension

### 1.0.1 (Not Yet Released)
Working on Undo and Redo Operations.


**Enjoy!**
