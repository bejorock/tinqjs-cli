// import chokidar from "chokidar";
const esbuild = require("esbuild");
const fs = require("fs");
const {
  dependencies,
  peerDependencies,
  name,
  version,
  author,
  keywords,
  repository,
  bin,
} = require("./package.json");
const { Generator } = require("npm-dts");

const { nodeExternalsPlugin } = require("esbuild-node-externals");

const esbuildOptions = {
  // outfile: "dist/lib.js",
  // outdir: "dist",
  bundle: true,
  minify: false,
  // platform: "node",
  // format: "esm",
  sourcemap: true,
  plugins: [nodeExternalsPlugin()],
  external: Object.keys(dependencies).concat(Object.keys(peerDependencies)),
};

async function buildEsm(files_) {
  return await esbuild
    .build({
      outfile: "dist/index.js",
      format: "cjs",
      platform: "node",
      target: "esnext",
      inject: ["./process-shim.js"],
      entryPoints: files_,
      ...esbuildOptions,
    })
    .catch(() => process.exit(1));
}

const files = ["src/index.ts"];

buildEsm(files)
  // .then(() => buildEsm(files))
  .then(() =>
    new Generator({
      entry: "index.ts",
      output: "dist/index.d.ts",
    })
      .generate()
      .then(() => console.log("create index.d.ts"))
  )
  .then(() =>
    fs.writeFileSync(
      "dist/package.json",
      JSON.stringify(
        {
          name,
          version,
          author,
          // module: "lib.esm.js",
          main: "index.js",
          typings: "index.d.ts",
          peerDependencies,
          dependencies,
          keywords,
          repository,
          bin,
        },
        null,
        2
      ),
      "utf-8"
    )
  )
  .then(() => console.log("create package.json"))
  .then(() => fs.copyFileSync("README.md", "dist/README.md"))
  .then(() => fs.copyFileSync("exec.js", "dist/exec.js"))
  .then(() => fs.copyFileSync("process-shim.js", "dist/process-shim.js"))
  .catch((err) => console.log(err))
  .finally(() => process.exit(0));
