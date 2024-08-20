import * as vscode from 'vscode';
import { createFlaskAppStructure } from '../utils/fileUtils';

export async function executeCreateFlaskAppCommand(uri: vscode.Uri | undefined) {
    
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

}