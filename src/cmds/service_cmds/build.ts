import fs from "fs";
import path from "path";
import { Generator } from "npm-dts";

import build from "../../actions/build";
import { ModuleConfig } from "../../types";

export const command = "build [service]";

export const desc = "build service";

export const builder = function (yargs) {
  return yargs.option("entry", {
    describe: "main entry",
    demandOption: false,
  });
};

export const handler = function (argv) {
  const baseDir = path.resolve(argv.baseDir);
  const baseConfig = JSON.parse(
    fs.readFileSync(path.resolve(baseDir, "tinqjs.config.json"), "utf-8")
  );

  const svcDir = path.resolve(
    baseDir,
    baseConfig.services.replace("*", ""),
    argv.service
  );

  const svcConfig: ModuleConfig = {
    srcDir: "src",
    outDir: "dist",
    entryPoints: ["index.ts"],
    ...JSON.parse(
      fs.readFileSync(
        path.resolve(svcDir, "tinqjs-service.config.json"),
        "utf-8"
      )
    ),
    ...(argv.entry ? { entryPoints: [argv.entry] } : {}),
  };

  if (svcConfig.noBuild) {
    console.log("build is disabled", argv.service);
    return;
  }

  // console.log(svcConfig);

  console.log(`build service`, argv.service);
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
    .catch((err) => console.log(err))
    .finally(() => process.exit());

  /* const svcPackageConfig = JSON.parse(
    fs.readFileSync(path.resolve(svcDir, "package.json"), "utf-8")
  );

  console.log(svcPackageConfig); */

  // console.log(baseConfig);

  // console.log(baseDir, process.cwd());
};
