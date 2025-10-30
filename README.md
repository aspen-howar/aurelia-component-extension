# New Aurelia Component

A Visual Studio Code extension that simplifies the creation and deletion of Aurelia components by generating all necessary files with proper naming conventions and templates.

## Features

This extension provides commands to quickly scaffold Aurelia components with the following capabilities:

- **Create Aurelia Component**: Generates TypeScript, HTML, and LESS files with proper naming conventions
- **Create Aurelia Component Folder**: Generates a folder structure with TypeScript, HTML, and LESS files
- **Delete Aurelia Component**: Removes all related component files when deleting one file

### Creating Components

The extension generates three files by default:
- `component-name.ts` - TypeScript class with Aurelia lifecycle methods
- `component-name.html` - HTML template with proper structure
- `component-name.less` - LESS stylesheet with component-specific styling

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
