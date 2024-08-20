import * as vscode from 'vscode';

import { executeCreateFlaskModuleCommand } from '../commands/createFlaskModule';

export function registerExecuteCreateFlaskModuleCommand(context: vscode.ExtensionContext) {
    const command = vscode.commands.registerCommand("extension.createFlaskModule", executeCreateFlaskModuleCommand);
    context.subscriptions.push(command);
}