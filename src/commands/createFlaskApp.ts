import * as vscode from 'vscode';
import { createFlaskAppStructure } from '../utils/fileUtils';

export function createFlaskAppCommand(context: vscode.ExtensionContext) {
    return vscode.commands.registerCommand(
        "extension.createFlaskApp",
        async (uri: vscode.Uri | undefined) => {
            if (!uri) {
                const folderUris = await vscode.window.showOpenDialog({
                    canSelectFolders: true,
                    canSelectMany: false,
                    openLabel: "Select folder to create Flask app in",
                });
                uri = folderUris && folderUris[0];
            }

            if (!uri) {
                return;
            }

            createFlaskAppStructure(uri);
        },
    );
}