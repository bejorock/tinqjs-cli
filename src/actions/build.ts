import path from "path";
import { esbuildPluginDecorator } from "esbuild-plugin-decorator";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import importGlobPlugin from "esbuild-plugin-import-glob";
import { globPlugin } from "esbuild-plugin-glob";
import esbuild from "esbuild";
import fs from "fs";

export default async function build(
  entryPoints: string[],
  rootDir: string,
  srcDir: string,
  outDir: string,
  onChange?: (result: esbuild.BuildResult) => void
) {
  let esbuildOptions: any = {
    // outfile: "dist/lib.js",
    // outdir: "dist",
    bundle: true,
    // platform: "node",
    // format: "esm",
    sourcemap: true,
    plugins: [
      // globPlugin(),
      nodeExternalsPlugin({
        packagePath: path.resolve(rootDir, "package.json"),
      }),
      esbuildPluginDecorator({
        compiler: "swc",
        tsconfigPath: path.resolve(rootDir, "./tsconfig.json"),
      }),
      importGlobPlugin(),
    ],
  };

  // make few modules externals
  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(rootDir, "package.json"), "utf-8")
  );

  if (packageJson.peerDependencies)
    esbuildOptions = {
      ...esbuildOptions,
      external: Object.keys(packageJson.peerDependencies),
    };

  /* if (process.env.MODULES_DIR) {
    esbuildOptions = {
      ...esbuildOptions,
      nodePaths: [path.resolve(process.env.MODULES_DIR)],
    };

  } */
  return await esbuild
    .build({
      outdir: path.resolve(rootDir, outDir),
      // outfile: path.resolve(rootDir, outDir, "index.ts"),
      format: "cjs",
      platform: "node",
      target: "esnext",
      inject: [path.resolve(__dirname, "./process-shim.js")],
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
      // external: ["pg-native"],
      ...esbuildOptions,
    })
    .catch(() => process.exit(1));
}
