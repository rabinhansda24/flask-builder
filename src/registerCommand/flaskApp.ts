import * as vscode from 'vscode';

import { executeCreateFlaskAppCommand } from '../commands/createFlaskApp';

export function registerCreateFlaskAppCommand(context: vscode.ExtensionContext) {
    const command = vscode.commands.registerCommand("extension.createFlaskApp", executeCreateFlaskAppCommand);
    context.subscriptions.push(command);
};