# Plate.js Usage Guide: Shortcuts & Editor Features

Plate.js is a modern, extensible rich text editor for React. This guide focuses on using the editor, keyboard shortcuts, markdown autoformat, and toolbar features.

---

## 🚀 Getting Started

1. **Install Plate.js**

```bash
pnpm add @udecode/plate @udecode/plate-core @udecode/plate-ui @udecode/plate-plugins
```

2. **Use the `<PlateEditor />` component** (see `src/components/editor/plate-editor.tsx`).

---

## 🖱️ Using the Editor

- **Type** as you would in any rich text editor.
- **Select text** to see context toolbars for formatting.
- **Right-click** or use the toolbar for block-level actions.
- **Drag blocks** using the drag handle at the left of each block.
- **Use the slash command (`/`)** to quickly insert elements.

---

## ⌨️ Keyboard Shortcuts

### Text Formatting

| Action        | Shortcut     |
| ------------- | ------------ |
| Bold          | Ctrl+B       |
| Italic        | Ctrl+I       |
| Underline     | Ctrl+U       |
| Strikethrough | Ctrl+Shift+X |
| Code          | Ctrl+E       |
| Superscript   | Ctrl+.       |
| Subscript     | Ctrl+,       |
| Highlight     | Ctrl+Shift+H |

### Headings & Blocks

| Action     | Shortcut     |
| ---------- | ------------ |
| Heading 1  | Ctrl+Alt+1   |
| Heading 2  | Ctrl+Alt+2   |
| Heading 3  | Ctrl+Alt+3   |
| Heading 4  | Ctrl+Alt+4   |
| Heading 5  | Ctrl+Alt+5   |
| Heading 6  | Ctrl+Alt+6   |
| Blockquote | Ctrl+Shift+> |
| Code Block | Ctrl+Alt+8   |

### Comments & Suggestions

| Action      | Shortcut     |
| ----------- | ------------ |
| Add Comment | Ctrl+Shift+M |

### Editor Actions

| Action              | Shortcut         |
| ------------------- | ---------------- |
| Exit Block          | Ctrl+Enter       |
| Exit Block (before) | Ctrl+Shift+Enter |

---

## 📝 Markdown & Autoformat Shortcuts

Type these at the start of a line, then press space or enter:

| Markdown         | Result               |
| ---------------- | -------------------- |
| `# `             | Heading 1            |
| `## `            | Heading 2            |
| `### `           | Heading 3            |
| `> `             | Blockquote           |
| `* ` or `- `     | Bulleted List        |
| `1. `            | Numbered List        |
| `[ ] ` or `[x] ` | Task List (checkbox) |
| `---` or `___`   | Horizontal Rule      |
| ```              | Code Block           |

**Inline marks:**

- `**bold**`, `*italic*`, `__underline__`, `~~strikethrough~~`, `` `code` ``, `==highlight==`, `^superscript^`, `~subscript~`

---

## 🛠️ Toolbar Usage

- **Fixed Toolbar:** Stays at the top for quick access to formatting, lists, links, media, etc.
- **Floating Toolbar:** Appears when you select text for inline formatting (bold, italic, link, etc).
- **Block Toolbar:** Use the left-side handle to drag, duplicate, or delete blocks.

---

## 📚 More Features

- **Slash Command (`/`)**: Type `/` to open a menu for inserting blocks, media, tables, etc.
- **Drag & Drop:** Move blocks or upload files/images by dragging.
- **Mentions & Emojis:** Type `@` for mentions, `:` for emojis.
- **Comments & Suggestions:** Collaborate with inline comments and tracked changes.

---

## 🔗 Resources

- [Plate.js Documentation](https://platejs.org/docs)
- [GitHub Repository](https://github.com/udecode/plate)
- [Examples](https://platejs.org/examples)

---

For more advanced usage, see the code in `src/components/editor/` and the Plate.js docs.
