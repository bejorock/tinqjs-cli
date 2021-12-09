import path from "path";
import { esbuildPluginDecorator } from "esbuild-plugin-decorator";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import importGlobPlugin from "esbuild-plugin-import-glob";
import esbuild from "esbuild";

export default async function build(
  entryPoints: string[],
  rootDir: string,
  srcDir: string,
  outDir: string,
  onChange?: (result: esbuild.BuildResult) => void
) {
  const esbuildOptions = {
    // outfile: "dist/lib.js",
    // outdir: "dist",
    bundle: true,
    // platform: "node",
    // format: "esm",
    sourcemap: true,
    plugins: [
      nodeExternalsPlugin(),
      esbuildPluginDecorator(),
      importGlobPlugin(),
    ],
  };

  return await esbuild
    .build({
      outdir: path.resolve(rootDir, outDir),
      // outfile: path.resolve(rootDir, outDir, "index.ts"),
      format: "cjs",
      platform: "node",
      target: "esnext",
      inject: [path.resolve(__dirname, "../process-shim.js")],
      watch: onChange
        ? {
            onRebuild(error, result) {
              if (error) console.error("watch build failed:", error);
              else onChange(result);
            },
          }
        : undefined,
      absWorkingDir: rootDir,
      entryPoints: entryPoints.map((e) => path.resolve(rootDir, srcDir, e)),
      ...esbuildOptions,
    })
    .catch(() => process.exit(1));
}
