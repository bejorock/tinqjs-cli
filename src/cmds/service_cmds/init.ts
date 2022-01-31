import path from "path";
import fs from "fs";
import buildPrompt from "../../ask";
import tsConfig from "../../template/tsconfig";
import { logger } from "../../logger";

export const command = "init <name>";

export const desc = "init service";

export const builder = function (yargs) {
  return yargs
    .option("http", {
      describe: "enabled http listener",
      demandOption: false,
      default: "false",
    })
    .option("typescript", {
      describe: "enabled typescript",
      demandOption: false,
      default: "false",
    });
};

export const handler = function (argv) {
  const ask = buildPrompt();

  const baseDir = path.resolve(argv.baseDir);
  const rootConfig = JSON.parse(
    fs.readFileSync(path.resolve(baseDir, "package.json"), "utf-8")
  );
  const config = JSON.parse(
    fs.readFileSync(path.resolve(baseDir, "tinqjs.config.json"), "utf-8")
  );

  const baseSvcDir = path.resolve(baseDir, config.services.replace("*", ""));
  const svcDir = path.resolve(baseSvcDir, argv.name);

  if (fs.existsSync(svcDir)) {
    logger.warn("cannot create directory at", svcDir);
    return;
  }

  (async () => {
    const packageConfig: any = {
      name: await ask(`question name (${argv.name}): `, argv.name),
      version: await ask(
        `question version (${rootConfig.version}): `,
        rootConfig.version
      ),
      description: await ask(`question description: `, ""),
      main: await ask(
        `question entry point (dist/index.js): `,
        "dist/index.js"
      ),
      author: await ask(`question author: `, rootConfig.author),
      license: await ask(`question license (MIT): `, "MIT"),
    };

    const defaultConfig: any = {
      name: argv.name,
      // srcDir: "src",
      // outDir: "dist",
      liveReload: true,
      enabled: true,
    };

    if (argv.http === "true")
      defaultConfig.http = {
        basePath: `/api/${argv.name}`,
        routeDir: `http`,
      };

    if (argv.typescript === "true")
      packageConfig.devDependencies = {
        typescript: "^4.5.2",
      };

    fs.mkdirSync(svcDir);
    fs.mkdirSync(path.resolve(svcDir, "src"));

    if (argv.typescript === "true")
      fs.writeFileSync(
        path.resolve(svcDir, "src", "index.ts"),
        Buffer.from("// bootstrap service here", "utf-8")
      );
    else
      fs.writeFileSync(
        path.resolve(svcDir, "src", "index.js"),
        Buffer.from("// bootstrap service here", "utf-8")
      );

    fs.writeFileSync(
      path.resolve(svcDir, "package.json"),
      JSON.stringify(packageConfig, null, 2)
    );
    fs.writeFileSync(
      path.resolve(svcDir, "tinqjs-service.config.json"),
      JSON.stringify(defaultConfig, null, 2)
    );

    if (argv.typescript === "true")
      fs.writeFileSync(
        path.resolve(svcDir, "tsconfig.json"),
        JSON.stringify(tsConfig, null, 2)
      );

    logger.info("init service", argv.name, "at", path.resolve(svcDir));
  })()
    .catch((err) => logger.error(err))
    .finally(() => process.exit());
};
