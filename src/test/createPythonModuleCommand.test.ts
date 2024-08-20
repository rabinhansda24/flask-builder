import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { suite, test, before, after } from 'mocha';
import sinon from 'sinon';

import { registerExecuteCreatePythonModuleCommand } from '../registerCommand/pythonModule';


suite('createPythonModuleCommand Test Suite', () => {
    const testFolder = path.join(__dirname, 'test-workspace');
    const testModule = 'test_module';
    let context: vscode.ExtensionContext;

    before(() => {
        // Ensure the test folder exists
        if(!fs.existsSync(testFolder)) {
            fs.mkdirSync(testFolder);
        }

        // Mock the ExtensionContext
        context = {
            subscriptions: []
        } as unknown as vscode.ExtensionContext;

        // Register the createPythonModule command
        registerExecuteCreatePythonModuleCommand(context);
    });

    test('should create a Python module with __init__.py', async function () {
        this.timeout(5000);  // Increase the timeout to 10 seconds)
        const inputBoxStub = sinon.stub(vscode.window, 'showInputBox').resolves(testModule);

        const uri = vscode.Uri.file(testFolder);
        await vscode.commands.executeCommand("extension.createPythonModule", uri);

        const modulePath = path.join(testFolder, testModule);
        const initFilePath = path.join(modulePath, '__init__.py');

        assert.strictEqual(fs.existsSync(modulePath), true, 'Module folder should exist');
        assert.strictEqual(fs.existsSync(initFilePath), true, '__init__.py file should exist');

        inputBoxStub.restore();
    });

    after(() => {
        // Restore all the sinon stubs
        sinon.restore();

        // Delete the test folder
        fs.rmSync(testFolder, { recursive: true });
    });
});