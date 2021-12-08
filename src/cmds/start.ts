import fs from "fs";
import path from "path";
import boot from "../actions/boot";
import { Lib, MainConfig, Service } from "../types";

export const command = "start [options]";

export const desc = "start project in development mode";

export const builder = function (yargs) {
  return yargs
    .option("b", {
      alias: "baseDir",
      describe: "base directory",
      demandOption: true,
      default: ".",
    })
    .option("http.port", {
      describe: "http port",
      demandOption: false,
    })
    .option("http.host", {
      describe: "http host",
      demandOption: false,
    });
};

export const handler = function (argv) {
  console.log("starting tinqjs server...", argv.baseDir);

  const baseDir = path.resolve(argv.baseDir);

  if (!fs.existsSync(path.resolve(baseDir, "tinqjs.config.json")))
    throw new Error("no tinqjs config found");

  const tinqjsConfig: MainConfig = JSON.parse(
    fs.readFileSync(path.resolve(baseDir, "tinqjs.config.json"), "utf-8")
  );

  const svcDirPath = path.resolve(
    baseDir,
    tinqjsConfig.services.replace("*", "")
  );
  const libDirPath = path.resolve(baseDir, tinqjsConfig.libs.replace("*", ""));

  const services: Service[] = [];
  const libs: Lib[] = [];

  for (const dir of fs.readdirSync(path.resolve(svcDirPath), {
    withFileTypes: true,
  })) {
    if (dir.isDirectory()) {
      const service: Service = {
        name: dir.name,
        rootDir: path.resolve(svcDirPath, dir.name),
      };

      services.push(service);
    }
  }

  for (const dir of fs.readdirSync(path.resolve(libDirPath), {
    withFileTypes: true,
  })) {
    if (dir.isDirectory()) {
      const lib: Lib = {
        name: dir.name,
        rootDir: path.resolve(svcDirPath, dir.name),
      };

      libs.push(lib);
    }
  }

  const http = {
    ...tinqjsConfig.http,
    ...(argv.http && argv.http.host && argv.http.host !== ""
      ? { host: argv.http.host }
      : {}),
    ...(argv.http && argv.http.port && argv.http.port !== ""
      ? { port: parseInt(argv.http.port) }
      : {}),
  };

  // console.log(argv);

  // console.log(services);
  boot({ services, http });

  // console.log(svcDir);
};
