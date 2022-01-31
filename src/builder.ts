import chokidar from "chokidar";
import esbuild from "esbuild";
import { esbuildPluginDecorator } from "esbuild-plugin-decorator";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import path from "path";

export default class Builder {
  files = [];
  ready = false;
  watcher = null;

  async build(options) {
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

  async watch(options, onReady, onChange) {
    this.watcher = chokidar.watch(
      path.resolve(options.rootDir, options.srcDir)
    );

    this.watcher
      .on("all", (event, path) => {
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
