import * as vscode from 'vscode';
import { getRootPath, isObject } from '../util';
import path from 'path';

export class TAttributeCompletionProvider implements vscode.CompletionItemProvider {
    private readonly commonResource = "node_modules/common/resources/common.json";
    private readonly localResourceMappings = {
        "AssayManager/AspenTech.AssayManager.Application/AspenTech.AssayManager.Application/AssayManagerUI": {
            "landing-page": "locales/en/assay-landing-page.json",
            "assay-workspace": "locales/en/assay-manager.json"
        },
        "AssayManager/AspenTech.AssayManager.Application/AspenTech.AssayManager.Application/DistillationModeManagerUI": {
            "landing-page": "locales/en/dmm-landing-page.json",
            "dmm-workspace": "locales/en/distillation-mode-manager.json"
        },
        "Aum/AspenUnified.AumServices/UI": {
            "landing-page": "locales/en/aum-landing-page.json",
            "aum-workspace": "locales/en/aum.json"
        },
        "Aura/AspenUnified.AuraServices/UI": {
            "landing-page": "locales/en/aura-landing-page.json",
            "aura-workspace": "locales/en/aura.json"
        },
        "UnifiedCatalog/AspenTech.UnifiedCatalog.Application/UI": {
            "landing-page": "locales/en/catalog-landing-page.json",
            "catalog-workspace": "locales/en/catalog.json"
        },
        "GDot/AspenUnified.GDot.AgentProvider/UI": {
            "landing-page": "locales/en/gdot-landing-page.json",
            "gdot-workspace": "locales/en/gdot.json"
        },
        "Planning/AgentProvider/AspenUnified.Planning.AgentProvider/UI": {
            "planning-workspace": "locales/en/planning.json",
            "landing-page": "landing-page/resources/planning-landing-page.json",
            "ExcelAddinUI": "ExcelAddinUI/resources/excel-addin.json"
        },
        "Scheduling/AspenTech.Psc.Scheduling.AgentProvider/UI": {
            "landing-page": "locales/en/scheduling-landing-page.json",
            "aus-workspace": "locales/en/scheduling.json",
            "ExcelAddinUI": "ExcelAddinUI/resources/excel-addin.json"
        },
        "SPSP/AspenTech.Psc.Spsp.AgentProvider/UI": {
            "landing-page": "locales/en/spsp-landing-page.json",
            "spsp-workspace": "locales/en/spsp.json"
        },
        "Platform/AspenTech.UnifiedPlatform/UI": {
            "landing-page": "locales/en/platform.json",
        }
    }

    public async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
    ): Promise<vscode.CompletionItem[]> {
        const lineText = document.lineAt(position.line).text;
        const textBeforeCursor = lineText.substring(0, position.character);
        const tAttributeInsideQuotes = textBeforeCursor.match(/\bt\s*=\s*["']([^"']*)$/);
        if (!tAttributeInsideQuotes) {
            return [];
        }

        const rootPath = getRootPath(document);
        if (!rootPath) {
            return [];
        }

        const common = await this.getCommon(rootPath);
        const local = await this.getLocal(rootPath, document.uri.fsPath);
        return [...common, ...local];
    }

    private async getCommon(rootPath: string): Promise<vscode.CompletionItem[]> {
        const appings = await this.getKeyValueMappings(
            [vscode.Uri.file(path.join(rootPath, this.commonResource))],
        );

        return appings.map(([key, value]) => this.createCompletionItem(`common:${key}`, value));
    }

    private async getLocal(rootPath: string, currentPath: string): Promise<vscode.CompletionItem[]> {
        const normalizedCurrentPath = path.normalize(currentPath);

        let localResourceUri: vscode.Uri[] = [];

        for (const [uiPath, mapping] of Object.entries(this.localResourceMappings)) {
            const normalizedUiPath = path.normalize(uiPath);

            if (!normalizedCurrentPath.includes(normalizedUiPath)) {
                continue;
            }

            for (const [dir, file] of Object.entries(mapping)) {
                const normalizedDirPath = path.normalize(path.join(rootPath, dir));

                if (normalizedCurrentPath.includes(normalizedDirPath)) {
                    localResourceUri.push(vscode.Uri.file(path.join(rootPath, file)));
                }
            }
        }

        const mapping = await this.getKeyValueMappings(localResourceUri);
        return mapping.map(([key, value]) => this.createCompletionItem(key, value));
    }

    private async getKeyValueMappings(resources: vscode.Uri[]): Promise<[string, string][]> {
        const keyValueMappings: [string, string][] = [];

        for (const uri of resources) {
            try {
                const data = await vscode.workspace.fs.readFile(uri);
                let content = Buffer.from(data).toString('utf-8');

                // Remove utf-8 BOM if present
                if (content.charCodeAt(0) === 0xFEFF) {
                    content = content.slice(1);
                }

                const json = JSON.parse(content);
                keyValueMappings.push(...this.obj2KeyValueMappings(json));
            } catch (error) {
                console.error(`Error reading JSON file ${uri.fsPath}:`, error);
            }
        }

        return keyValueMappings;
    }

    private obj2KeyValueMappings(obj: any, prefix = ''): [string, string][] {
        if (!isObject(obj)) {
            return [];
        }

        const completionItems: [string, string][] = [];
        const getFullKey = (key: string) => prefix ? `${prefix}.${key}` : key;

        for (const key of Object.keys(obj)) {
            const value = obj[key];

            if (isObject(value)) {
                const childMappings = this.obj2KeyValueMappings(value, getFullKey(key));
                completionItems.push(...childMappings);
            } else if (typeof value === 'string') {
                const fullKey = getFullKey(key);
                completionItems.push([fullKey, value]);
            }
        }

        return completionItems;
    }

    private createCompletionItem(key: string, value: string): vscode.CompletionItem {
        const completionItem = new vscode.CompletionItem(
            value,
            vscode.CompletionItemKind.Value
        );

        completionItem.detail = key;
        completionItem.documentation = new vscode.MarkdownString(
            `${key}: ${value}`
        );
        completionItem.insertText = key;
        return completionItem;
    }
}
