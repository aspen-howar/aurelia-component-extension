import * as vscode from 'vscode';
import * as path from 'path';

const CUSTOM_COMPONENT_REGEX = /[a-z]+-[a-z0-9\-]+/i;
const cache = new Map<string, vscode.Location>();

export class AureliaDefinitionProvider implements vscode.DefinitionProvider {

    public provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
    ): vscode.ProviderResult<vscode.Definition | vscode.DefinitionLink[]> {
        console.log('[AureliaDefinitionProvider] provideDefinition called at position:', position.line, position.character);
        
        // Get the word at cursor position (handles kebab-case)
        const wordRange = document.getWordRangeAtPosition(position, CUSTOM_COMPONENT_REGEX);
        console.log('[AureliaDefinitionProvider] wordRange:', wordRange);
        
        if (!wordRange) {
            console.log('[AureliaDefinitionProvider] No word range found');
            return null;
        }

        const word = document.getText(wordRange);
        console.log('[AureliaDefinitionProvider] word found:', word);

        // Check if this word is inside an HTML tag
        const lineText = document.lineAt(position.line).text;
        const tagPattern = new RegExp(`</?\\s*${word}[\\s>]`, 'i');
        
        if (!tagPattern.test(lineText)) {
            console.log('[AureliaDefinitionProvider] Word is not inside an HTML tag');
            return null;
        }

        const tagName = word;
        console.log('[AureliaDefinitionProvider] Looking for component:', tagName);
        return this.findComponentFile(document, tagName);
    }

    private async findComponentFile(
        document: vscode.TextDocument,
        tagName: string,
    ): Promise<vscode.Location | null> {
        const findRoot = document.uri.fsPath.indexOf("UI")
        if (findRoot === -1) {
            return null;
        }

        if (cache.has(tagName)) {
            return cache.get(tagName)!;
        }

        const rootPath = document.uri.fsPath.substring(0, findRoot + 2);
        const localHtmlFiles = await vscode.workspace.findFiles(new vscode.RelativePattern(rootPath, `**/**.html`), '**/node_modules/**');
        const commonHtmlFiles = await vscode.workspace.findFiles(new vscode.RelativePattern(rootPath, `/node_modules/common/**/**.html`));

        for (const file of [...localHtmlFiles, ...commonHtmlFiles]) {
            const location = new vscode.Location(file, new vscode.Position(0, 0));
            cache.set(path.basename(file.fsPath, path.extname(file.fsPath)), location);
        }

        return cache.get(tagName) || null;
    }
}
