import * as vscode from 'vscode';

export const CUSTOM_COMPONENT_REGEX = /([a-z\_]+(-[a-z0-9\_]+)*)/i;
export const REQUIRED_PATH_REGEX = /from\s*=\s*["']([a-z0-9\_\/\.-]+)["']?/i;

export function toPascalCase(str: string): string {
    return str
        .replace(/-+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
        .replace(/^(.)/, (_, char) => char ? char.toUpperCase() : '');
}

export function toKebabCase(str: string): string {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
}

const ROOT_FOLDER_NAME = "UI";

export function getRootPath(document: vscode.TextDocument): string | null {
    const index = document.uri.fsPath.indexOf(ROOT_FOLDER_NAME);
    if (index === -1) {
        return null;
    }
    return document.uri.fsPath.substring(0, index + ROOT_FOLDER_NAME.length);
}

export async function findFilesInUIRoot(document: vscode.TextDocument, ext: string, inCommon = false): Promise<vscode.Uri[]> {
    const rootPath = getRootPath(document);

    if (!rootPath) {
        return [];
    }

    if (inCommon) {
        const commonPath = vscode.Uri.file(vscode.Uri.joinPath(vscode.Uri.file(rootPath), 'node_modules', 'common').fsPath);
        const pattern = new vscode.RelativePattern(commonPath, `**/*${ext}`);
        return vscode.workspace.findFiles(pattern);
    } else {
        const pattern = new vscode.RelativePattern(rootPath, `**/*${ext}`);
        return vscode.workspace.findFiles(pattern, '**/node_modules/**');
    }
}

export function isObject(item: any): item is Record<string, any> {
    return (item && typeof item === 'object' && !Array.isArray(item));
}