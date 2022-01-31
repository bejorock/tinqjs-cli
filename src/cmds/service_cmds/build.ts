import fs from "fs";
import path from "path";
import { Generator } from "npm-dts";

import build from "../../actions/build";
import { ModuleConfig } from "../../types";
import { logger } from "../../logger";

const getSvcDir = (argv) => {
  if (!argv.service) return path.resolve(".");

  const baseDir = path.resolve(argv.baseDir);
  const baseConfig = JSON.parse(
    fs.readFileSync(path.resolve(baseDir, "tinqjs.config.json"), "utf-8")
  );

  return path.resolve(
    baseDir,
    baseConfig.services.replace("*", ""),
    argv.service
  );
};

export const command = "build [service]";

export const desc = "build service";

export const builder = function (yargs) {
  return yargs
    .option("entry", {
      describe: "main entry",
      demandOption: false,
    })
    .option("modulesDir", {
      describe: "extra node_modules dir",
      demandOption: false,
    });
};

export const handler = function (argv) {
  const svcDir = getSvcDir(argv);
  const svc = JSON.parse(
    fs.readFileSync(path.resolve(svcDir, "tinqjs-service.config.json"), "utf-8")
  );

  if (argv.modulesDir) process.env.MODULES_DIR = argv.modulesDir;

  const svcConfig: ModuleConfig = {
    srcDir: "src",
    outDir: "dist",
    entryPoints: ["index.ts"],
    ...svc,
    ...(argv.entry ? { entryPoints: [argv.entry] } : {}),
  };

  if (svcConfig.noBuild) {
    logger.info("build is disabled", svc.name);
    return;
  }

  logger.info(`build service`, svc.name);
  build(svcConfig.entryPoints, svcDir, svcConfig.srcDir, svcConfig.outDir)
    .then(() =>
      Promise.all(
        svcConfig.entryPoints.map((e) =>
          new Generator({
            root: svcDir,
            entry: path.resolve(svcDir, svcConfig.srcDir, e),
            output: path.resolve(
              svcDir,
              svcConfig.outDir,
              e.substr(0, e.length - 3) + ".d.ts"
            ),
          }).generate()
        )
      )
    )
    .catch((err) => logger.error(err))
    .finally(() => process.exit());
};
