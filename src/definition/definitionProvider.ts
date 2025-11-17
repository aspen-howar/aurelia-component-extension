import * as vscode from 'vscode';
import * as path from 'path';
import { findFilesInUIRoot, REQUIRED_PATH_REGEX, CUSTOM_COMPONENT_REGEX } from '../util';

const extMappings: Record<string, string> = {
    ".css": ".less"
}

export class AureliaDefinitionProvider implements vscode.DefinitionProvider {
    public async provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
    ): Promise<vscode.Definition | vscode.DefinitionLink[] | null> {
        const lineText = document.lineAt(position.line).text;
        const text = lineText.match(REQUIRED_PATH_REGEX)?.[1];
        let location = null;

        if (text) {
            let fullPath = this.getFullPath(document, text);
            location = await this.findFileByPath(fullPath);
        } else {
            const text = lineText.match(CUSTOM_COMPONENT_REGEX)?.[1];
            if (!text) return null;

            location = await this.findFileByTag(document, text);
        }

        if (location) {
            vscode.commands.executeCommand('revealInExplorer', location.uri);
        }

        return location;
    }

    private async findFileByPath(refrenceFilePath: string): Promise<vscode.Location | null> {
        let fileUri = vscode.Uri.file(refrenceFilePath);

        try {
            await vscode.workspace.fs.stat(fileUri);
        } catch {
            const ext = path.extname(refrenceFilePath);

            if (extMappings[ext]) {
                refrenceFilePath = refrenceFilePath.replace(ext, extMappings[ext]);
                fileUri = vscode.Uri.file(refrenceFilePath);
            } else {
                return null;
            }

            try {
                await vscode.workspace.fs.stat(fileUri);
            } catch {
                return null;
            }
        }

        const location = new vscode.Location(fileUri, new vscode.Position(0, 0));
        return location;
    }

    private getFullPath(document: vscode.TextDocument, relativePath: string): string {
        let fullPath = path.join(path.dirname(document.uri.fsPath), relativePath);

        if (!path.extname(fullPath)) {
            fullPath += ".ts";
        }

        return fullPath;
    }

    private async findFileByTag(
        document: vscode.TextDocument,
        tagName: string,
    ): Promise<vscode.Location | null> {
        const localHtmlFiles = await findFilesInUIRoot(document, ".html");
        const commonHtmlFiles = await findFilesInUIRoot(document, ".html", true);

        for (const file of [...localHtmlFiles, ...commonHtmlFiles]) {
            if (tagName === path.basename(file.fsPath, path.extname(file.fsPath))) {
                return new vscode.Location(file, new vscode.Position(0, 0));
            }
        }

        return null;
    }
}
