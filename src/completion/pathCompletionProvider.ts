import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getRootPath, REQUIRED_PATH_REGEX } from '../util';

export class PathCompletionProvider implements vscode.CompletionItemProvider {
    public async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
    ): Promise<vscode.CompletionItem[]> {
        const rootPath = getRootPath(document);
        if (!rootPath) {
            return [];
        }

        const lineText = document.lineAt(position.line).text;
        const textBeforeCursor = lineText.substring(0, position.character);
        const pathMatch = textBeforeCursor.match(REQUIRED_PATH_REGEX);

        if (!pathMatch) {
            return [];
        }

        let fullPath = "";

        if (pathMatch[1].startsWith('common/')) {
            fullPath = path.join(rootPath, 'node_modules', pathMatch[1]);
        } else {
            fullPath = path.join(path.dirname(document.uri.fsPath), pathMatch[1]);
        }

        return this.getCompletions(fullPath);
    }

    private async getCompletions(
        absolutePath: string
    ): Promise<vscode.CompletionItem[]> {
        const completionItems: vscode.CompletionItem[] = [];

        try {
            const entries = await fs.promises.readdir(absolutePath, { withFileTypes: true });

            for (const entry of entries) {
                if (!entry.isDirectory() && !entry.isFile()) {
                    continue;
                }

                if (entry.isDirectory() && entry.name === 'node_modules') {
                    continue;
                }

                if (![".ts", ".html", ".less", ".json"].includes(path.extname(entry.name))) {
                    continue;
                }

                const completionItem = entry.isDirectory() ? this.getDirectoryCompletionItem(entry, absolutePath) : this.getFileCompletionItem(entry, absolutePath);
                completionItems.push(completionItem);

                const componentItem = this.getComponentCompletionItem(entry, absolutePath);
                if (componentItem) {
                    completionItems.unshift(componentItem);
                }
            }
        } catch (error) {
            console.error(`Error reading directory ${absolutePath}:`, error);
        }

        return completionItems;
    }

    private getDirectoryCompletionItem(dir: fs.Dirent, parentPath: string): vscode.CompletionItem {
        const completionItem = new vscode.CompletionItem(
            dir.name,
            vscode.CompletionItemKind.Folder
        );

        completionItem.detail = `Folder in ${parentPath}`;
        completionItem.documentation = new vscode.MarkdownString(
            `Folder: \`${parentPath}/${dir.name}\``
        );

        completionItem.insertText = dir.name + '/';
        completionItem.command = {
            command: 'editor.action.triggerSuggest',
            title: 'Re-trigger completions'
        };

        return completionItem;
    }

    private getFileCompletionItem(file: fs.Dirent, parentPath: string): vscode.CompletionItem {
        const completionItem = new vscode.CompletionItem(
            file.name,
            vscode.CompletionItemKind.File
        );
        completionItem.detail = `File in ${parentPath}`;
        completionItem.documentation = new vscode.MarkdownString(
            `File: \`${parentPath}/${file.name}\``
        );

        completionItem.insertText = file.name;

        return completionItem;
    }

    private getComponentCompletionItem(file: fs.Dirent, parentPath: string): vscode.CompletionItem | null {
        const ext = path.extname(file.name);

        if (ext === ".html") {
            file.name = file.name.replace(ext, '');
            return this.getFileCompletionItem(file, parentPath);
        }

        return null;
    }
}
