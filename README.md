# Tinqjs Cli

A simple tools to develop microservices as if it is a single application. Works in yarn workspace.

## Installation

---

```sh
npm install -g @tinqjs/tinjs-cli
```

## Usage

---

For CLI options, use the -h (or --help) for argument

```sh
tinqjs-cli -h
```

Initate a project workspace

```sh
cd <projectdir>

tinqjs-cli init -b . --http.enabled=true --typescript=true
```

```sh
Options:
      --version       Show version number                              [boolean]
      --help          Show help                                        [boolean]
  -b, --baseDir       base directory                   [required] [default: "."]
      --http.enabled  enable http server                      [default: "false"]
      --http.port     http port                                [default: "3001"]
      --http.host     http bind ip                          [default: "0.0.0.0"]
      --typescript    enable typescript                       [default: "false"]
```

Initiate a service

```sh
tinqjs-cli service init <name> --http=true --typescript=true
```

```sh
Options:
      --version     Show version number                                [boolean]
      --help        Show help                                          [boolean]
  -b, --baseDir     base directory                     [required] [default: "."]
      --http        enabled http listener                     [default: "false"]
      --typescript  enabled typescript                        [default: "false"]
```

Build a service

```sh
tinqjs-cli service build [service]
```

```sh
Options:
      --version  Show version number                                   [boolean]
      --help     Show help                                             [boolean]
  -b, --baseDir  base directory                        [required] [default: "."]
      --entry    main entry
```

Start the project with all services

```sh
tinqjs-cli start
```

```sh
Options:
      --version    Show version number                                 [boolean]
      --help       Show help                                           [boolean]
  -b, --baseDir    base directory                      [required] [default: "."]
      --http.port  http port
      --http.host  http host
```

## Configurations

tinqjs.config.json configuration for a project

```json
{
  "libs": "lib/*", // library packages directory
  "services": "services/*", // services directory (e.g: http, mq sub, etc)
  "http": {
    "host": "0.0.0.0", // gateway host binding
    "port": 3001 // gateway port binding
  }
}
```

tinqjs-service.config.json configuration for a service

```json
{
  "name": "greet", // name of service (must unique)
  "main": "dist/index.js", // [optional] override main entry point if differ from package.json
  "entryPoints": [
    /* entrypoints */
  ], // [optional] entrypoints for build
  "liveReload": true, // if false no need to watch for changes
  "srcDir": "src", // [optional] source files for auto build
  "outDir": "dist", // [optional] destination files for auto build
  "noBuild": false, // [optional] if false never build this service
  "enabled": true, // if false services will not be started using cli
  "http": {
    "basePath": "/api/greet", // base path for http service
    "routeDir": "http" // routing dir for express handlers
  }
}
```

## Examples

Checkout project https://github.com/bejorock/tinqjs-example for samples how to use it
