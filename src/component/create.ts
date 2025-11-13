import * as vscode from 'vscode';
import { toPascalCase } from '../util';

const componentName = "_COMPONENT_NAME_";

enum NamingCase {
    PascalCase = "PascalCase",
    KebabCase = "kebab-case"
}

async function getFileTemplate(ext: string, context: vscode.ExtensionContext): Promise<string> {
    const templatePath = vscode.Uri.joinPath(context.extensionUri, 'src', 'template', `template${ext}`);

    try {
        const templateContent = await vscode.workspace.fs.readFile(templatePath);
        return Buffer.from(templateContent).toString('utf8');
    } catch (error) {
        return "";
    }
}

export async function createAureliaComponent(folderUri: vscode.Uri, kebabName: string, context: vscode.ExtensionContext) {
    const pascalName = toPascalCase(kebabName);

    const config = vscode.workspace.getConfiguration('newAureliaComponent');
    const fileSettings = config.get<Array<{ ext: string, namingCase: NamingCase }>>('fileTypes') || [
        { ext: '.ts', namingCase: NamingCase.PascalCase },
        { ext: '.html', namingCase: NamingCase.KebabCase },
        { ext: '.less', namingCase: NamingCase.KebabCase }
    ];

    for (const setting of fileSettings) {
        let template = await getFileTemplate(setting.ext, context);
        template = template.replaceAll(componentName, setting.namingCase === NamingCase.PascalCase ? pascalName : kebabName);
        const fileUri = vscode.Uri.joinPath(folderUri, `${kebabName}${setting.ext}`);
        await vscode.workspace.fs.writeFile(fileUri, Buffer.from(template, 'utf8'));
    }
}

export function inputComponentName(): Thenable<string | undefined> {
    return vscode.window.showInputBox({
        prompt: 'Enter the Aurelia component name',
        placeHolder: 'my-component',
        validateInput: (value) => {
            if (!value || value.trim().length === 0) {
                return 'Component name cannot be empty';
            }
            if (!/^[a-zA-Z][a-zA-Z0-9-]*$/.test(value)) {
                return 'Component name must start with a letter and contain only letters, numbers, and hyphens';
            }
            return null;
        }
    });
}