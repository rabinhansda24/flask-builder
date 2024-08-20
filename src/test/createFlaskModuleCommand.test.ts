import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { suite, test, before, after } from 'mocha';
import sinon from 'sinon';

import { executeCreateFlaskAppCommand } from '../commands/createFlaskApp';
import { executeCreateFlaskModuleCommand } from '../commands/createFlaskModule';
import { registerExecuteCreateFlaskModuleCommand } from '../registerCommand/flaskModule';

suite('createFlaskModuleCommand Test Suite', () => {
    const testFolder = path.join(__dirname, 'test-workspace');
    const moduleName = 'testmodule';
    let context: vscode.ExtensionContext;

    before(async function () {
        this.timeout(10000);  // Increase the timeout to 10 seconds

        // Ensure the test folder exists
        if (!fs.existsSync(testFolder)) {
            fs.mkdirSync(testFolder);
        }

        // Mock the ExtensionContext
        context = {
            subscriptions: []
        } as unknown as vscode.ExtensionContext;

        // Mock command registration to prevent re-registration errors
        sinon.stub(vscode.commands, 'registerCommand').callThrough();


        registerExecuteCreateFlaskModuleCommand(context);

        const uri = vscode.Uri.file(testFolder);
        await executeCreateFlaskAppCommand(uri);
    });

    test('Should create a Flask module with necessary files', async function () {
        this.timeout(5000);  // Increase the timeout to 5 seconds

        const inputBoxStub = sinon.stub(vscode.window, 'showInputBox').resolves(moduleName);

        const uri = vscode.Uri.file(path.join(testFolder, 'app', 'modules')); // Place the module within the app structure
        await executeCreateFlaskModuleCommand(uri);

        const moduleDir = path.join(uri.fsPath, moduleName);
        const expectedFiles = ['controller.py', 'route.py', `${moduleName}_tests.py`];

        assert.strictEqual(fs.existsSync(moduleDir), true, 'Module directory should exist');
        for (const file of expectedFiles) {
            const filePath = path.join(moduleDir, file);
            assert.strictEqual(fs.existsSync(filePath), true, `${file} should exist`);
        }

        // Check if the integration test file is created in the 'tests' directory within the Flask app
        const testsDir = path.join(testFolder, 'app', 'tests');
        const integrationTestFilePath = path.join(testsDir, `tests_${moduleName}.py`);
        assert.strictEqual(fs.existsSync(integrationTestFilePath), true, `Integration test file ${integrationTestFilePath} should exist`);

        inputBoxStub.restore();
    });

    after(() => {
        // Restore the original registerCommand function
        sinon.restore();

        // Clean up test folder
        if (fs.existsSync(testFolder)) {
            fs.rmSync(testFolder, { recursive: true, force: true });
        }
    });
});
