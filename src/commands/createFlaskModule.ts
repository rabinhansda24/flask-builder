import * as vscode from 'vscode';
import { createModule } from '../utils/fileUtils';

export async function executeCreateFlaskModuleCommand(uri: vscode.Uri | undefined) {

    if (!uri) {
        const folderUris = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: "Select folder to create Flask module in",
        });
        uri = folderUris && folderUris[0];
    }

    if (!uri) {
        return;
    }

    const moduleName = await vscode.window.showInputBox({
        prompt: "Enter the name of the Flask module",
    });

    if (!moduleName) {
        return;
    }

    createModule(uri.fsPath, moduleName);

};