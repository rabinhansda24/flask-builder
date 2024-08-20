import * as vscode from 'vscode';

import { executeCreatePythonModuleCommand } from '../commands/createPythonModule';

export function registerExecuteCreatePythonModuleCommand(context: vscode.ExtensionContext) {
    const command = vscode.commands.registerCommand("extension.createPythonModule", executeCreatePythonModuleCommand);
    context.subscriptions.push(command);
}