import * as vscode from 'vscode';
import { toKebabCase } from './util';
import { createAureliaComponent, inputComponentName } from './component/create';
import { deleteAureliaComponent } from './component/delete';
import { AureliaDefinitionProvider, cleanUp } from './definition/definitionProvider';
import { AureliaCompletionProvider } from './completion/completionProvider';

export async function activate(context: vscode.ExtensionContext) {
	const createDisposable = vscode.commands.registerCommand('new-aurelia-component.create', async (uri: vscode.Uri) => {
		try {
			let folderName = await inputComponentName();
			if (!folderName) {
				return;
			}

			folderName = toKebabCase(folderName);
			await createAureliaComponent(uri, folderName, context);
		} catch (err) {
			vscode.window.showErrorMessage('Failed to create Aurelia component: ' + err);
		}
	});

	const createFolderDisposable = vscode.commands.registerCommand('new-aurelia-component.folderCreate', async (uri: vscode.Uri) => {
		try {
			let folderName = await inputComponentName();
			if (!folderName) {
				return;
			}

			folderName = toKebabCase(folderName);

			const folderUri = vscode.Uri.joinPath(uri, folderName);
			await vscode.workspace.fs.createDirectory(folderUri);
			await createAureliaComponent(folderUri, folderName, context);
		} catch (err) {
			vscode.window.showErrorMessage('Failed to create Aurelia component folder: ' + err);
		}
	});

	const deleteDisposable = vscode.commands.registerCommand('new-aurelia-component.delete', (uri: vscode.Uri) => {
		deleteAureliaComponent(uri);
	});

	const definitionProvider = vscode.languages.registerDefinitionProvider(
		{ scheme: 'file', language: 'html' },
		new AureliaDefinitionProvider()
	);

	const completionProvider = vscode.languages.registerCompletionItemProvider(
		{ scheme: 'file', language: 'html' },
		new AureliaCompletionProvider(),
		'/'
	);

	context.subscriptions.push(createDisposable);
	context.subscriptions.push(createFolderDisposable);
	context.subscriptions.push(deleteDisposable);
	context.subscriptions.push(definitionProvider);
	context.subscriptions.push(completionProvider);
}

export function deactivate() { 
	cleanUp();
}
