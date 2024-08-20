import * as vscode from 'vscode';
import { createDirectoryAndInit } from '../utils/fileUtils';

export async function executeCreatePythonModuleCommand(uri: vscode.Uri | undefined) {

    if (!uri) {
        const folderUris = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: "Select folder to create Python module in",
        });
        uri = folderUris && folderUris[0];
    }

    if (!uri) {
        return;
    }

    const moduleName = await vscode.window.showInputBox({
        prompt: "Enter the name of the Python module",
    });

    if (!moduleName) {
        return;
    }

    createDirectoryAndInit(uri, moduleName);

}