// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Function to create directory and init
function createDirectoryAndInit(uri: vscode.Uri, dirName: string) {
	const folderPath = path.join(uri.fsPath, dirName);
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath);
		fs.writeFileSync(path.join(folderPath, '__init__.py'), '');
		console.log(`Created directory and __init__.py: ${folderPath}`);
	}
}

// Main modules
function createMainModule(uri: vscode.Uri) {
	const mainDir = path.join(uri.fsPath, 'modules', 'main');

	if (!fs.existsSync(mainDir)) {
		createDirectoryAndInit(vscode.Uri.file(path.join(uri.fsPath, 'modules')), 'main');
		console.log(`Created directory: ${mainDir}`);
	}

	// Create controller file in main module
	const controllerPath = path.join(mainDir, 'controller.py');
	if (!fs.existsSync(controllerPath)) {
		fs.writeFileSync(controllerPath, `class MainController:\n
			"""Main controller."""\n
			def __init__(self):
			    pass
			def index(self):\n
				return 'Hello, world!'\n
		`);
		console.log(`Created controller.py: ${controllerPath}`);
	}

	// Create route file in main module
	const routePath = path.join(mainDir, 'route.py');
	if (!fs.existsSync) {
		fs.writeFileSync(routePath, `from flask import Blueprint\nfrom .controller import MainController\n\nmain_bp = Blueprint('main', __name__)\n\nmain_controller = MainController()\n\n@main_bp.route('/')\ndef index():\n    return main_controller.index()\n`);
		console.log(`Created route.py: ${routePath}`);
	}

	// create tests file in main module
	const testsPath = path.join(mainDir, 'tests_main.py');
	if (!fs.existsSync(testsPath)) {
		fs.writeFileSync(testsPath, `import pytest
from app.modules.main.controller import MainController

class TestMainController:
    def setup_method(self):
        self.controller = MainController()

    def test_get_message(self):
        assert self.controller.get_message() == 'Hello, World!'
`);
		console.log(`Created tests_main.py: ${testsPath}`);
	}

}

// Function to create Flask structure
function createFlaskAppStructure(uri: vscode.Uri) {
	const appDir = path.join(uri.fsPath, 'app');
	if (!fs.existsSync(appDir)) {
		fs.mkdirSync(appDir);
		console.log(`Created directory: ${appDir}`);
	}

	createDirectoryAndInit(vscode.Uri.file(appDir), 'config');
	createDirectoryAndInit(vscode.Uri.file(appDir), 'db');
	createDirectoryAndInit(vscode.Uri.file(appDir), 'modules');
	createDirectoryAndInit(vscode.Uri.file(appDir), 'tests');

	// Create run.py
	const runPyPath = path.join(uri.fsPath, 'run.py');
	if (!fs.existsSync(runPyPath)) {
		fs.writeFileSync(runPyPath, `import os\nfrom dotenv import load_dotenv\nfrom app.app import create_app\n\nload_dotenv()\n\nconfig=os.getenv('FLASK_ENV') or 'development'\n\napp = create_app(config)\n\nif __name__ == "__main__":\n    if config == 'development':\n        app.run(debug=True)\n    else:\n        from werkzeug.serving import run_simple\n        run_simple('0.0.0.0', 5000, app)\n`);
		console.log(`Created run.py: ${runPyPath}`);
	}

	// Create wsgi.py
	const wsgiPyPath = path.join(uri.fsPath, 'wsgi.py');
	if (!fs.existsSync(wsgiPyPath)) {
		fs.writeFileSync(wsgiPyPath, `from app.app import create_app\n\napp = create_app('production')\n`);
		console.log(`Created wsgi.py: ${wsgiPyPath}`);
	}

	// Create app/app.py
	const appPyPath = path.join(appDir, 'app.py');
	if (!fs.existsSync(appPyPath)) {
		fs.writeFileSync(appPyPath, `from flask import Flask\nfrom app.config.config import get_config_by_name\n\ndef create_app(config=None) -> Flask:\n    """\n    Create a Flask application.\n\n    Args:\n        config: The configuration object to use.\n\n    Returns:\n        A Flask application instance.\n    """\n    app = Flask(__name__)\n    if config:\n        app.config.from_object(config)\n\n    # Initialize extensions\n    # TODO: Initialize extensions here\n\n    # Register blueprints\n    # TODO: Register blueprints here\n\n    return app\n`);
		console.log(`Created app.py: ${appPyPath}`);
	}

	// Create app/config/config.py
	const configPath = path.join(appDir, 'config', 'config.py');
	if (!fs.existsSync(configPath)) {
		fs.writeFileSync(configPath, `class BaseConfig:\n    """Base configuration."""\n    DEBUG = False\n    TESTING = False\n    SQLALCHEMY_TRACK_MODIFICATIONS = False\n    SECRET_KEY = 'your-secret-key'\n\nclass DevelopmentConfig(BaseConfig):\n    """Development configuration."""\n    DEBUG = True\n    SQLALCHEMY_DATABASE_URI = 'sqlite:///development.db'\n\nclass TestingConfig(BaseConfig):\n    """Testing configuration."""\n    DEBUG = True\n    TESTING = True\n    SQLALCHEMY_DATABASE_URI = 'sqlite:///testing.db'\n\nclass ProductionConfig(BaseConfig):\n    """Production configuration."""\n    DEBUG = False\n    SQLALCHEMY_DATABASE_URI = 'sqlite:///production.db'\n\n\ndef get_config_by_name(config_name):\n    """ Get config by name """\n    if config_name == 'development':\n        return DevelopmentConfig()\n    elif config_name == 'production':\n        return ProductionConfig()\n    elif config_name == 'testing':\n        return TestingConfig()\n    else:\n        return DevelopmentConfig()\n`);
		console.log(`Created config.py: ${configPath}`);
	}

	// Create .env file
	const envFilePath = path.join(uri.fsPath, '.env');
	if (!fs.existsSync(envFilePath)) {
		fs.writeFileSync(envFilePath, `FLASK_APP=run.py\nFLASK_ENV=development\nSECRET_KEY=your-secret-key\nSQLALCHEMY_DATABASE_URI=sqlite:///development.db\n`);
		console.log(`Created .env: ${envFilePath}`);
	}

	// Create DB file and initialize it in app/db/db.py
	const dbPath = path.join(appDir, 'db', 'db.py');
	if (!fs.existsSync(dbPath)) {
		fs.writeFileSync(dbPath, `from flask_sqlalchemy import SQLAlchemy\nfrom sqlalchemy.orm import DeclarativeBase\n\n\nclass Base(DeclarativeBase):\n    pass\n\n\ndb = SQLAlchemy(model_class=Base)\n`);
		console.log(`Created db.py: ${dbPath}`);
	}

	// Create app/initialize_functions.py
	const initializeFunctionsPath = path.join(appDir, 'initialize_functions.py');
	if (!fs.existsSync(initializeFunctionsPath)) {
		fs.writeFileSync(initializeFunctionsPath, `from flask import Flask\nfrom app.db.db import db\n\n\ndef initialize_route(app: Flask):\n    with app.app_context():\n        pass\n\n\ndef initialize_db(app: Flask):\n    with app.app_context():\n        db.init_app(app)\n        db.create_all()\n`);
		console.log(`Created initialize_functions.py: ${initializeFunctionsPath}`);
	}

	// Create conftest.py file in tests folder for pytest with fixtures and client
	const conftestPath = path.join(appDir, 'tests', 'conftest.py');
	if (!fs.existsSync(conftestPath)) {
		fs.writeFileSync(conftestPath, `import pytest\n\nfrom app.app import create_app\n\n\n@pytest.fixture\ndef app():\n    app = create_app('testing')\n    app.config.update({"TESTING": True})\n    yield app\n\n\n@pytest.fixture\ndef client(app):\n    return app.test_client()`);
		console.log(`Created conftest.py: ${conftestPath}`);
	}

	// Create requirements.txt file
	const requirementsPath = path.join(uri.fsPath, 'requirements.txt');
	if (!fs.existsSync(requirementsPath)) {
		fs.writeFileSync(requirementsPath, `Flask\nFlask-SQLAlchemy\npython-dotenv\npytest\ngunicorn\n`);
		console.log(`Created requirements.txt: ${requirementsPath}`);
	}

	// Create Dockerfile
	const dockerfilePath = path.join(uri.fsPath, 'Dockerfile');
	if (!fs.existsSync(dockerfilePath)) {
		fs.writeFileSync(dockerfilePath, `# Use the official image as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV FLASK_APP wsgi.py

# Run app.py when the container launches
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app"]
`);
		console.log(`Created Dockerfile: ${dockerfilePath}`);
	}

	// Create docker-compose.yml file
	const dockerComposePath = path.join(uri.fsPath, 'docker-compose.yml');
	if (!fs.existsSync(dockerComposePath)) {
		fs.writeFileSync(dockerComposePath, `version: '3.8'

services:
  web:
    build: .
    command: gunicorn --bind 0.0.0.0:5000 wsgi:app
    volumes:
      - .:/app
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
`);
		console.log(`Created docker-compose.yml: ${dockerComposePath}`);
	}

	// Create modules/main directory
	// createMainModule(uri);
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "create-flask-app" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let createPythonModuleCommand = vscode.commands.registerCommand('extension.createPythonModule', async (uri: vscode.Uri | undefined) => {
		if (!uri) {
			const folderUris = await vscode.window.showOpenDialog({
				canSelectFolders: true,
				canSelectMany: false,
				openLabel: 'Select folder to create Python module in'
			});
			uri = folderUris && folderUris[0];
		}

		if (!uri) {
			return;
		}

		const moduleName = await vscode.window.showInputBox({
			prompt: 'Enter the name of the Python module'
		});

		if (!moduleName) {
			return;
		}

		createDirectoryAndInit(uri, moduleName);
	});

	let createFlaskAppCommand = vscode.commands.registerCommand('extension.createFlaskApp', async (uri: vscode.Uri | undefined) => {
		if (!uri) {
			const folderUris = await vscode.window.showOpenDialog({
				canSelectFolders: true,
				canSelectMany: false,
				openLabel: 'Select folder to create Flask app in'
			});
			uri = folderUris && folderUris[0];
		}

		if (!uri) {
			return;
		}

		createFlaskAppStructure(uri);
	});

	context.subscriptions.push(createPythonModuleCommand);
	context.subscriptions.push(createFlaskAppCommand);
}

// This method is called when your extension is deactivated
export function deactivate() { }
