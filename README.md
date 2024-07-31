# Flask Builder

Flask Builder is a Visual Studio Code extension designed to quickly scaffold a Flask application with the necessary modules, Docker support, and OOP-style tests. 

## Features

- **Flask App Structure**: Automatically creates a Flask application structure with `config`, `db`, `modules`, and `tests` directories.
- **Main Module**: Includes a `main` module inside the `modules` directory with a sample route, controller, and OOP-style tests.
- **Docker Support**: Generates a `Dockerfile` and `docker-compose.yml` for easy Docker setup.
- **.env File**: Adds a default `.env` file for environment variables.
- **Testing**: Includes Pytest configuration and example tests.

## Usage

1. **Create Flask App**:
   - Right-click on a folder in the Explorer view.
   - Select `Create Flask App`.

## Example

The generated structure includes:
```
app/
├── config/
│   ├── __init__.py
│   └── config.py
├── db/
│   ├── __init__.py
│   └── db.py
├── modules/
│   └── main/
│       ├── __init__.py
│       ├── routes.py
│       ├── controller.py
│       └── tests_main.py
├── tests/
│   ├── __init__.py
│   └── conftest.py
├── app.py
├── initialize_functions.py
├── run.py
└── wsgi.py
Dockerfile
docker-compose.yml
.env
requirements.txt
```


## Requirements

- Visual Studio Code v1.91.0 or higher

## Installation

1. Download and install the extension from the VSCode Marketplace.
2. Reload VSCode.

## Release Notes

### 1.1.0

- Bug fix: app module

---



## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)


**Enjoy using Flask Builder! If you have any issues or suggestions, please open an issue on the [GitHub repository](#).**
