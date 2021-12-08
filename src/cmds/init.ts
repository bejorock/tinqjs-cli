import fs from "fs";
import path from "path";
import readline from "readline";
import util from "util";
import colors from "colors";
import buildPrompt from "../ask";
import { MainConfig } from "../types";
import tsConfig from "../template/tsconfig";

export const command = "init [options]";

export const desc = "init project directory";

export const builder = function (yargs) {
  return yargs
    .option("b", {
      alias: "baseDir",
      describe: "base directory",
      demandOption: true,
      default: ".",
    })
    .option("http.enabled", {
      describe: "enable http server",
      demandOption: false,
      default: "false",
    })
    .option("http.port", {
      describe: "http port",
      demandOption: false,
      default: "3001",
    })
    .option("http.host", {
      describe: "http bind ip",
      demandOption: false,
      default: "0.0.0.0",
    })
    .option("typescript", {
      describe: "enable typescript",
      demandOption: false,
      default: "false",
    });
};

export const handler = function (argv) {
  const ask = buildPrompt();

  (async () => {
    const rootConfig = JSON.parse(
      fs.readFileSync(path.resolve("package.json"), "utf-8")
    );

    console.log(colors.white.bold(`TinQjs Init v${rootConfig.version}`));
    const dirPath = path.resolve(argv.baseDir);
    // console.log(dirPath);

    if (fs.existsSync(dirPath)) throw new Error("folder already exists");

    const packageConfig: any = {
      name: await ask(
        `question name (${path.basename(dirPath)}): `,
        path.basename(dirPath)
      ),
      version: await ask(
        `question version (${rootConfig.version}): `,
        rootConfig.version
      ),
      description: await ask(`question description: `, ""),
      main: await ask(`question entry point (index.js): `, "index.js"),
      author: await ask(`question author: `, rootConfig.author),
      license: await ask(`question license (MIT): `, "MIT"),
      private: true,
      workspaces: ["lib/*", "services/*"],
    };

    const defaultConfig: MainConfig = {
      libs: "lib/*",
      services: "services/*",
    };

    const lernaConfig = {
      packages: ["lib/*", "services/*"],
      version: "1.0.0",
    };

    if (argv.http.enabled === "true") {
      defaultConfig.http = {
        host: argv.http.host,
        port: parseInt(argv.http.port),
      };
    }

    if (argv.typescript === "true") {
      packageConfig.devDependencies = {
        typescript: "^4.5.2",
      };
    }

    fs.mkdirSync(dirPath);
    fs.mkdirSync(path.resolve(dirPath, "lib"));
    fs.mkdirSync(path.resolve(dirPath, "services"));

    fs.writeFileSync(
      path.resolve(dirPath, "package.json"),
      Buffer.from(JSON.stringify(packageConfig, null, 2), "utf-8")
    );

    fs.writeFileSync(
      path.resolve(dirPath, "tinqjs.config.json"),
      Buffer.from(JSON.stringify(defaultConfig, null, 2), "utf-8")
    );

    fs.writeFileSync(
      path.resolve(dirPath, "lerna.json"),
      Buffer.from(JSON.stringify(lernaConfig, null, 2), "utf-8")
    );

    if (argv.typescript === "true")
      fs.writeFileSync(
        path.resolve(dirPath, "tsconfig.json"),
        Buffer.from(JSON.stringify(tsConfig, null, 2), "utf-8")
      );

    console.log("init project for dir", dirPath);
  })()
    .catch((err) => console.log(err))
    .finally(() => process.exit());
};
