import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { suite, test, before, after } from 'mocha';
import sinon from 'sinon';

import { executeCreateFlaskAppCommand } from '../commands/createFlaskApp';
import { registerCreateFlaskAppCommand } from '../registerCommand/flaskApp';

suite('createFlaskAppCommand Test Suite', () => {
    const testFolder = path.join(__dirname, 'test-workspace');
    let context: vscode.ExtensionContext;

    before(() => {
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
        
    });

    test('should create a Flask app structure', async function () {
        this.timeout(10000);  // Increase the timeout to 10 seconds

        // Register the createFlaskApp command
        //registerCreateFlaskAppCommand(context);

        const uri = vscode.Uri.file(testFolder);
        await executeCreateFlaskAppCommand(uri);

        const appDir = path.join(testFolder, 'app');
        const expectedFiles = [
            'run.py', 'wsgi.py', 'Dockerfile', 'requirements.txt', '.env',
            'app/app.py', 'app/config/config.py', 'app/db/db.py',
            'app/tests/conftest.py', 'app/modules/main/controller.py'
        ];

        assert.strictEqual(fs.existsSync(appDir), true, 'App directory should exist');
        for (const file of expectedFiles) {
            const filePath = path.join(testFolder, file);
            assert.strictEqual(fs.existsSync(filePath), true, `${file} should exist`);
        }
    });

    after(() => {
        // Restore the original registerCommand function
        sinon.restore();

        // Clean up test folder
        if (fs.existsSync(testFolder)) {
            fs.rmSync(testFolder, { recursive: true });
        }
    });
});
