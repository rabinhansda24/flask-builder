import * as vscode from "vscode";
import { createFlaskAppCommand } from "./commands/createFlaskApp";
import { createFlaskModuleCommand } from "./commands/createFlaskModule";
import { createPythonModuleCommand } from "./commands/createPythonModule";

export function activate(context: vscode.ExtensionContext) {
  

    context.subscriptions.push(createPythonModuleCommand(context));
    context.subscriptions.push(createFlaskAppCommand(context));
    context.subscriptions.push(createFlaskModuleCommand(context));
}

// This method is called when your extension is deactivated
export function deactivate() { }
