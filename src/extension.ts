import * as vscode from "vscode";
import { registerCreateFlaskAppCommand } from "./registerCommand/flaskApp";
import { registerExecuteCreateFlaskModuleCommand } from "./registerCommand/flaskModule";
import { registerExecuteCreatePythonModuleCommand } from "./registerCommand/pythonModule";

export function activate(context: vscode.ExtensionContext) {

    registerCreateFlaskAppCommand(context);
    registerExecuteCreateFlaskModuleCommand(context);
    registerExecuteCreatePythonModuleCommand(context);

}

// This method is called when your extension is deactivated
export function deactivate() { }
