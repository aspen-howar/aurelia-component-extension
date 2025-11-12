# New Aurelia Component

A Visual Studio Code extension that simplifies the creation and deletion of Aurelia components by generating all necessary files with proper naming conventions and templates.

## Features

This extension provides commands to quickly scaffold Aurelia components with the following capabilities:

- **Create Aurelia Component**: Generates TypeScript, HTML, and LESS files with proper naming conventions
- **Create Aurelia Component Folder**: Generates a folder structure with TypeScript, HTML, and LESS files
- **Delete Aurelia Component**: Removes all related component files when deleting one file
- **Go to Definition**: Press F12 on custom Aurelia component tags in HTML to navigate to their TypeScript class definitions
- **HTML Snippets**: Quick insertion of common Aurelia component tags with IntelliSense

### Creating Components

The extension generates three files by default:
- `component-name.ts` - TypeScript class with Aurelia lifecycle methods
- `component-name.html` - HTML template with proper structure
- `component-name.less` - LESS stylesheet with component-specific styling

### Creating Component Folders

When creating a component folder, the extension generates a directory containing the three files mentioned above, allowing for better organization of components.   

### Deleting Components

When you delete any component file, the extension automatically removes all related files to keep your workspace clean.

## Requirements

- Visual Studio Code 1.74.0 or higher
- Aurelia project (recommended)

## Extension Settings

This extension contributes the following settings:

- `newAureliaComponent.fileTypes`: Array of file types to generate with their naming conventions
  - Default: `[{ "ext": ".ts", "namingCase": "PascalCase" }, { "ext": ".html", "namingCase": "kebab-case" }, { "ext": ".less", "namingCase": "kebab-case" }]`
- `newAureliaComponent.toDeleteExtensions`: Array of file extensions to delete when removing a component
  - Default: `[".ts", ".less", ".html", ".js", ".css", ".js.map"]`

### Example Configuration

```json
{
    "newAureliaComponent.fileTypes": [
        { "ext": ".ts", "namingCase": "PascalCase" },
        { "ext": ".html", "namingCase": "kebab-case" },
        { "ext": ".scss", "namingCase": "kebab-case" }
    ],
    "newAureliaComponent.toDeleteExtensions": [".ts", ".scss", ".html", ".js", ".css", ".js.map"]
}
```

## Usage

### Creating a Component

1. Right-click on a folder in the Explorer panel
2. Select "New Aurelia Component" from the context menu
3. Enter the component name in kebab-case (e.g., `my-awesome-component`)
4. The extension will generate all necessary files with appropriate content

### Creating a Component Folder

1. Right-click on a folder in the Explorer panel
2. Select "New Aurelia Component Folder" from the context menu
3. Enter the component name in kebab-case (e.g., `my-awesome-component`)
4. The extension will generate a folder structure with all necessary files and appropriate content

### Deleting a Component

1. Right-click on any component file (`.ts`, `.html`, `.less`, etc.)
2. Select "Delete Aurelia Component" from the context menu
3. All related component files will be removed

### HTML Snippets

The extension provides Aurelia-focused HTML element snippets. Begin typing a tag like `<check-box`, `<text-field`, `<autocomplete-box`, etc. in an HTML file and use IntelliSense (Ctrl+Space) to expand.

Snippets include tab stops for fast filling of attributes. Example expansion for `<autocomplete-box`:

```html
<autocomplete-box value.bind="${1}" get-suggestions.call="${2:getSuggestions($event)}" disabled.bind="${3:false}" placeholder="${4:Search...}"></autocomplete-box>
```

Then press Tab to move through:
1. Bound value
2. Suggestion callback
3. Disabled flag
4. Placeholder text

Available prefixes (partial list):
`<check-box`, `<text-field`, `<text-area`, `<number-field`, `<number-input`, `<switch-button`, `<radio-button`, `<dropdown-button`, `<select-menu`, `<search-box`, `<autocomplete-box`, `<datetime-input`, `<datetime-picker-view`, `<calendar-picker`, `<date-range-input`, `<date-range-picker`, `<color-picker`, `<progress-bar`, `<input-chips`, `<choice-chips`, `<filter-chips`, `<dropdown-chips`, `<dropdown-search-box`, `<navigation-tree`, `<group-menu`, `<tooltip`.

You can view or customize these in `snippets/aurelia-components.json` inside the extension source.

### Go to Definition

The extension provides intelligent navigation for Aurelia custom elements:

1. Open an HTML file containing Aurelia component tags (e.g., `<my-component>`, `<user-profile>`)
2. Place your cursor on the component tag name
3. Press **F12** (or right-click and select "Go to Definition")
4. The extension will navigate to the corresponding TypeScript class file

**How it works:**
- Recognizes kebab-case custom element tags (e.g., `<my-component>`)
- Searches for the matching `.ts` file (e.g., `my-component.ts`)
- Jumps to the `export class` declaration (e.g., `export class MyComponent`)
- Searches in the same directory first, then the entire workspace

**Example:**
```html
<template>
  <user-profile user.bind="currentUser"></user-profile>
  <!-- Press F12 on "user-profile" to jump to user-profile.ts -->
</template>
```

## Generated File Structure

For a component named `user-profile`, the extension creates:

```
user-profile.ts      // PascalCase class: UserProfile
user-profile.html    // Template with proper require statements
user-profile.less    // Stylesheet with component class selector
```

## Template Content

The generated files include:

- **TypeScript**: Aurelia component class with all lifecycle methods (`created`, `bind`, `attached`, `detached`, `unbind`)
- **HTML**: Template with CSS require statement and component wrapper div
- **LESS**: Component-specific stylesheet with class selector

## Known Issues

- Component name validation requires names to start with a letter and contain only letters, numbers, and hyphens
- Template files must be present in the extension directory for proper file generation

## Release Notes

### 1.0.0

Initial release with:
- Aurelia component creation with TypeScript, HTML, and LESS files
- Component deletion functionality
- Configurable file types and naming conventions
- Template-based file generation

---

## Contributing

This extension follows VS Code extension guidelines and best practices.

**Enjoy building Aurelia applications faster!**
