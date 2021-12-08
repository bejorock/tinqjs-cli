import chokidar from "chokidar";
import esbuild from "esbuild";

import { esbuildPluginDecorator } from "esbuild-plugin-decorator";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import path from "path";
import fs from "fs";

import { ModuleConfig } from "../types";
import build from "./build";

const cache: {
  [key: string]: {
    config: ModuleConfig;
    // onReady: () => void;
    onChange: (result: esbuild.BuildResult) => void;
  };
} = {};

/* export class Builder {
  files = [];
  ready = false;
  watcher = null;

  async build(options: ModuleConfig) {
    const esbuildOptions = {
      outdir: path.resolve(options.rootDir, options.outDir),
      bundle: false,
      minify: false,
      platform: "node",
      format: "cjs",
      sourcemap: "inline",
      plugins: [
        nodeExternalsPlugin(),
        esbuildPluginDecorator({
          compiler: "swc",
          tsconfigPath: path.resolve(options.rootDir, "tsconfig.json"),
        }),
      ],
    };

    return await esbuild
      .build({
        target: "node12",
        entryPoints: this.files,
        ...esbuildOptions,
      } as any)
      .catch(() => process.exit(1));
  }

  async watch(options: ModuleConfig, onReady, onChange) {
    this.watcher = chokidar.watch(
      path.resolve(options.rootDir, options.srcDir)
    );

    this.watcher
      .on("all", (event, path) => {
        // console.log(event);
        if (event === "add") this.files.push(path);

        if (
          (event === "add" || event === "unlink" || event === "change") &&
          this.ready
        ) {
          // build(files, esbuildOptions).then((r) => onChange());
          onChange();
        }
      })
      .on("ready", () => {
        this.ready = true;
        this.build(options).then((r) => {
          onReady();
        });
      });
  }

  async close() {
    await this.watcher.close();
  }
}

export class Watcher {
  ready = false;
  watcher = null;

  async watch(options: ModuleConfig, onReady, onChange) {
    this.watcher = chokidar.watch(
      path.resolve(options.rootDir, options.srcDir)
    );

    this.watcher
      .on("all", (event, path) => {
        if (
          (event === "add" || event === "unlink" || event === "change") &&
          this.ready
        ) {
          // build(files, esbuildOptions).then((r) => onChange());
          onChange();
        }
      })
      .on("ready", () => {
        this.ready = true;
        onReady();
      });
  }

  async close() {
    await this.watcher.close();
  }
} */

export default function liveReload(
  config: ModuleConfig,
  // onReady: () => void,
  onChange: (result: esbuild.BuildResult) => void
) {
  cache[config.name] = { config, onChange };

  if (config.noBuild) {
    console.log("skipping build", config.name);
    return;
  }

  const checkDependencies = (result: esbuild.BuildResult) => {
    for (const key in cache) {
      if (key === config.name) continue;

      const packageConfig = JSON.parse(
        fs.readFileSync(
          path.resolve(cache[key].config.rootDir, "package.json"),
          "utf-8"
        )
      );

      const deps = {
        ...(packageConfig.dependencies || {}),
        ...(packageConfig.devDependencies || {}),
      };

      for (const dep in deps) {
        if (dep === config.name) {
          cache[key].onChange(result);
          break;
        }
      }
    }

    onChange(result);
  };

  build(
    config.entryPoints,
    config.rootDir,
    config.srcDir,
    config.outDir,
    checkDependencies
  );

  // check if tsconfig.json exists
  /* if (fs.existsSync(path.resolve(config.rootDir, "tsconfig.json"))) {
    const builder = new Builder();

    builder.watch(config, onReady, checkDependencies);
  } else {
    const watcher = new Watcher();

    watcher.watch(config, onReady, checkDependencies);
  } */
}
