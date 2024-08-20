import * as path from 'path';
import Mocha from 'mocha';
import { glob } from 'glob';

export function run(): Promise<void> {
    // Create the mocha test
    const mocha = new Mocha({
        ui: 'bdd',
        color: true,
    });

    const testsRoot = path.resolve(__dirname);

    return new Promise(async (resolve, reject) => {

        const files = await glob('**/*.test.js', { cwd: testsRoot });

        console.log('Test files:', files);
            
        // Add files to the test suite
        files.forEach((f: any) => {
            mocha.addFile(path.resolve(testsRoot, f));
            console.log('Added test file:', f);
        });

        try {
            // Run the mocha test
            mocha.run((failures: any) => {
                if (failures > 0) {
                    reject(new Error(`${failures} tests failed.`));
                } else {
                    resolve();
                }
            });
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
   
}
