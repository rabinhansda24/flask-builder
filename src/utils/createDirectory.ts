import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

// Function to create directory and init
export function createDirectoryAndInit(uri: vscode.Uri, dirName: string) {
  const folderPath = path.join(uri.fsPath, dirName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    fs.writeFileSync(path.join(folderPath, "__init__.py"), "");
  }
}
