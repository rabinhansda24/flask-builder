import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { appendRouteToInitializeFunctions } from "../utils/initilizeUtils";
import { createGitIgnore } from "../utils/gitIgnoreUtils";
import { createDirectoryAndInit } from "./createDirectory";


// Function to create Flask structure
export function createFlaskAppStructure(uri: vscode.Uri) {
  const appDir = path.join(uri.fsPath, "app");
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir);
  }

  createDirectoryAndInit(vscode.Uri.file(appDir), "config");
  createDirectoryAndInit(vscode.Uri.file(appDir), "db");
  createDirectoryAndInit(vscode.Uri.file(appDir), "modules");
  createDirectoryAndInit(vscode.Uri.file(appDir), "tests");

  // Create app/__init__.py
  const initPyPath = path.join(appDir, "__init__.py");
  if (!fs.existsSync(initPyPath)) {
    fs.writeFileSync(initPyPath, "");
  }

  // Create run.py
  const runPyPath = path.join(uri.fsPath, "run.py");
  if (!fs.existsSync(runPyPath)) {
    fs.writeFileSync(
      runPyPath,
      `import os\nfrom dotenv import load_dotenv\nfrom app.app import create_app\n\nload_dotenv()\n\nconfig=os.getenv('FLASK_ENV') or 'development'\n\napp = create_app(config)\n\nif __name__ == "__main__":\n    if config == 'development':\n        app.run(debug=True)\n    else:\n        from werkzeug.serving import run_simple\n        run_simple('0.0.0.0', 5000, app)\n`,
    );
  }

  // Create wsgi.py
  const wsgiPyPath = path.join(uri.fsPath, "wsgi.py");
  if (!fs.existsSync(wsgiPyPath)) {
    fs.writeFileSync(
      wsgiPyPath,
      `from app.app import create_app\n\napp = create_app('production')\n`,
    );
  }

  // Create app/app.py
  const appPyPath = path.join(appDir, "app.py");
  if (!fs.existsSync(appPyPath)) {
    fs.writeFileSync(
      appPyPath,
      `from flask import Flask\nfrom app.config.config import get_config_by_name\nfrom app.initialize_functions import initialize_route, initialize_db, initialize_swagger\n\ndef create_app(config=None) -> Flask:\n    """\n    Create a Flask application.\n\n    Args:\n        config: The configuration object to use.\n\n    Returns:\n        A Flask application instance.\n    """\n    app = Flask(__name__)\n    if config:\n        app.config.from_object(get_config_by_name(config))\n\n    # Initialize extensions\n    initialize_db(app)\n\n    # Register blueprints\n    initialize_route(app)\n\n    # Initialize Swagger\n    initialize_swagger(app)\n\n    return app\n`,
    );
  }

  // Create app/config/config.py
  const configPath = path.join(appDir, "config", "config.py");
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(
      configPath,
      `class BaseConfig:\n    """Base configuration."""\n    DEBUG = False\n    TESTING = False\n    SQLALCHEMY_TRACK_MODIFICATIONS = False\n    SECRET_KEY = 'your-secret-key'\n\nclass DevelopmentConfig(BaseConfig):\n    """Development configuration."""\n    DEBUG = True\n    SQLALCHEMY_DATABASE_URI = 'sqlite:///development.db'\n\nclass TestingConfig(BaseConfig):\n    """Testing configuration."""\n    DEBUG = True\n    TESTING = True\n    SQLALCHEMY_DATABASE_URI = 'sqlite:///testing.db'\n\nclass ProductionConfig(BaseConfig):\n    """Production configuration."""\n    DEBUG = False\n    SQLALCHEMY_DATABASE_URI = 'sqlite:///production.db'\n\n\ndef get_config_by_name(config_name):\n    """ Get config by name """\n    if config_name == 'development':\n        return DevelopmentConfig()\n    elif config_name == 'production':\n        return ProductionConfig()\n    elif config_name == 'testing':\n        return TestingConfig()\n    else:\n        return DevelopmentConfig()\n`,
    );
  }

  // Create .env file
  const envFilePath = path.join(uri.fsPath, ".env");
  if (!fs.existsSync(envFilePath)) {
    fs.writeFileSync(
      envFilePath,
      `FLASK_APP=run.py\nFLASK_ENV=development\nSECRET_KEY=your-secret-key\nSQLALCHEMY_DATABASE_URI=sqlite:///development.db\n`,
    );
  }

  // Create DB file and initialize it in app/db/db.py
  const dbPath = path.join(appDir, "db", "db.py");
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(
      dbPath,
      `from flask_sqlalchemy import SQLAlchemy\nfrom sqlalchemy.orm import DeclarativeBase\n\n\nclass Base(DeclarativeBase):\n    pass\n\n\ndb = SQLAlchemy(model_class=Base)\n`,
    );
  }

  // Create conftest.py file in tests folder for pytest with fixtures and client
  const conftestPath = path.join(appDir, "tests", "conftest.py");
  if (!fs.existsSync(conftestPath)) {
    fs.writeFileSync(
      conftestPath,
      `import pytest\n\nfrom app.app import create_app\n\n\n@pytest.fixture\ndef app():\n    app = create_app('testing')\n    app.config.update({"TESTING": True})\n    yield app\n\n\n@pytest.fixture\ndef client(app):\n    return app.test_client()`,
    );
  }

  // Create requirements.txt file
  const requirementsPath = path.join(uri.fsPath, "requirements.txt");
  if (!fs.existsSync(requirementsPath)) {
    fs.writeFileSync(
      requirementsPath,
      `Flask\nFlask-SQLAlchemy\npython-dotenv\npytest\ngunicorn\nflasgger\n`,
    );
  }

  // Create Dockerfile
  const dockerfilePath = path.join(uri.fsPath, "Dockerfile");
  if (!fs.existsSync(dockerfilePath)) {
    fs.writeFileSync(
      dockerfilePath,
      `# Use the official image as a parent image
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
`,
    );
  }

  // Create docker-compose.yml file
  const dockerComposePath = path.join(uri.fsPath, "docker-compose.yml");
  if (!fs.existsSync(dockerComposePath)) {
    fs.writeFileSync(
      dockerComposePath,
      `version: '3.8'

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
`,
    );
  }

  // Create .dockerignore file
  const dockerIgnorePath = path.join(uri.fsPath, ".dockerignore");
  if (!fs.existsSync(dockerIgnorePath)) {
    fs.writeFileSync(
      dockerIgnorePath,
      `__pycache__\n*.pyc\n*.pyo\n*.pyd\n*.db\n*.sqlite\n*.log\n*.env\n`,
    );
  }

  // Create .gitignore file
  createGitIgnore(uri);

  // Create a module in app/modules
  let moduleDir = path.join(appDir, "modules");
  createModule(moduleDir, "main");
}

// Function to create a module
export function createModule(appDir: string, name: string = "") {
  if (!name) {
    return;
  }

  let name_capitalize = name.charAt(0).toUpperCase() + name.slice(1);

  const moduleDir = path.join(appDir, name);

  if (!fs.existsSync(moduleDir)) {
    createDirectoryAndInit(vscode.Uri.file(appDir), name);
  }

  // Create a controller file in app/modules/<name>
  const controllerPath = path.join(moduleDir, "controller.py");
  let controllerClass = name_capitalize + "Controller";
  if (!fs.existsSync(controllerPath)) {
    fs.writeFileSync(
      controllerPath,
      `class ${controllerClass}:\n    def index(self):\n        return {'message':'Hello, World!'}\n`,
    );
  }

  // Create a route file in app/modules/<name>
  const routePath = path.join(moduleDir, "route.py");
  if (!fs.existsSync(routePath)) {
    fs.writeFileSync(
      routePath,
      `from flask import Blueprint, make_response, jsonify
from .controller import ${controllerClass}


${name}_bp = Blueprint('${name}', __name__, url_prefix='/${name}')
${name}_controller = ${controllerClass}()
@${name}_bp.route('/', methods=['GET'])
def index():
    """ Example endpoint with simple greeting.
    ---
    tags:
      - Example API
    responses:
      200:
        description: A simple greeting
        schema:
          type: object
          properties:
            data:
              type: object
              properties:
                message:
                  type: string
                  example: "Hello World!"
    """
    result=${name}_controller.index()
    return make_response(jsonify(data=result))
      `,
    );
  }

  // Create a tests file in app/modules/<name>
  let testFileName = name + "_tests.py";
  const testsPath = path.join(moduleDir, testFileName);
  if (!fs.existsSync(testsPath)) {
    fs.writeFileSync(
      testsPath,
      `import unittest\nimport json\n\nfrom app.modules.${name}.controller import ${controllerClass}\n\n\ndef test_index():\n    ${name}_controller = ${controllerClass}()\n    result = ${name}_controller.index()\n    assert result == {'message': 'Hello, World!'}\n`,
    );
  }

  // Create a integration test file in app/tests/tests_<name>.py
  let integrationTestFileName = "tests_" + name + ".py";
  const integrationTestsPath = path.join(
    appDir,
    "..",
    "tests",
    integrationTestFileName,
  );
  if (!fs.existsSync(integrationTestsPath)) {
    fs.writeFileSync(
      integrationTestsPath,
      `import json

class Test${name_capitalize}():
    def test_index(self, client):
        response = client.get('/')
        assert response.status_code == 200
        assert response.json == {'message': 'Hello, World!'}
            `,
    );
  }

  // Append route registration to initialize_functions.py
  appendRouteToInitializeFunctions(appDir, name);
}
