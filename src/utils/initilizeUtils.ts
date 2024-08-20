import * as fs from 'fs';
import * as path from 'path';

// Function to append route registration to initialize_functions.py
export function appendRouteToInitializeFunctions(appDir: string, name: string = "") {
    const initializeFunctionsPath = path.join(appDir, "..", "initialize_functions.py");
    const blueprintRegistration = `\n        app.register_blueprint(${name}_bp)`;
    const importStatement = `from app.modules.${name}.route import ${name}_bp\n`;

    if (fs.existsSync(initializeFunctionsPath)) {
        // Check if the blueprint is already registered
        let content = fs.readFileSync(initializeFunctionsPath, "utf-8");

        // Check if the import statement is already present
        if (!content.includes(importStatement)) {
            const updatedContent = `${importStatement}${content}`;
            fs.writeFileSync(initializeFunctionsPath, updatedContent);
        }
        content = fs.readFileSync(initializeFunctionsPath, "utf-8");
        if (!content.includes(`app.register_blueprint(${name}_bp)`)) {
            // Find the index of the app context line
            const appContextLine = 'with app.app_context():';
            const appContextIndex = content.indexOf(appContextLine);
            if (appContextIndex !== -1) {
                // Insert the new blueprint registration after the app context line
                const beforeAppContext = content.substring(0, appContextIndex + appContextLine.length);
                const afterAppContext = content.substring(appContextIndex + appContextLine.length);

                const newContent = `${beforeAppContext}${blueprintRegistration}${afterAppContext}`;

                fs.writeFileSync(initializeFunctionsPath, newContent);
            }
        } else {
            console.log(
                `Route already registered in initialize_functions.py: ${initializeFunctionsPath}`,
            );
        }
    } else {
        // If the file does not exist, create it with the necessary content
        const newContent = `from flask import Flask\nfrom app.modules.${name}.route import ${name}_bp\nfrom app.db.db import db\n\n\ndef initialize_route(app: Flask):\n    with app.app_context():${blueprintRegistration}\n\n\ndef initialize_db(app: Flask):\n    with app.app_context():\n        db.init_app(app)\n        db.create_all()\n`;
        fs.writeFileSync(initializeFunctionsPath, newContent);
    }
}