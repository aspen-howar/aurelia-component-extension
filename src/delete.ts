import * as vscode from 'vscode';
import path from 'path';

const DEFAULT_EXTENSIONS = [".ts", ".less", ".html", ".js", ".css", ".js.map"];

function getToDeleteExtensions(): string[] {
    const config = vscode.workspace.getConfiguration('newAureliaComponent');
    return config.get<string[]>('toDeleteExtensions') || DEFAULT_EXTENSIONS;
}

export function deleteAureliaComponent(uri: vscode.Uri) {
    const parsedPath = path.parse(uri.fsPath);
    const toDeleteExtensions = getToDeleteExtensions();
    if (!toDeleteExtensions.includes(parsedPath.ext)) {
        return;
    }

    try {
        toDeleteExtensions.forEach(ext => {
            const filePath = path.join(parsedPath.dir, parsedPath.name + ext);
            vscode.workspace.fs.delete(vscode.Uri.file(filePath));
        });
    } catch (error) {
        vscode.window.showErrorMessage('Failed to delete Aurelia component files: ' + error);
    }
}