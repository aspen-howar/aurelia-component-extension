import * as vscode from 'vscode';
import { toKebabCase } from './util';
import { createAureliaComponent, inputComponentName } from './create';
import { deleteAureliaComponent } from './delete';


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

	context.subscriptions.push(createDisposable);
	context.subscriptions.push(createFolderDisposable);
	context.subscriptions.push(deleteDisposable);
}

export function deactivate() { }
