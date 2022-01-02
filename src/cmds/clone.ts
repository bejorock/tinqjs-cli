import fetch from "node-fetch";

export const command = "clone <url> [options]";

export const desc = "clone project with its environment";

export const builder = function (yargs) {
  return yargs.option("cloud", {
    describe: "cloud provider",
    default: "docker",
    demandOption: false,
  });
};

export const handler = async (argv) => {
  // console.log(argv);
  /* const outDir = path.resolve(`/tmp/${Math.round(Date.now() / 1000)}`);

  try {
    console.log(`git clone ${argv.url} ${outDir}`);
    let result = execSync(`git clone ${argv.url} ${outDir}`);
    console.log(result.toString("utf-8"));

    const packageJson = JSON.parse(
      fs.readFileSync(path.resolve(outDir, "package.json"), "utf-8")
    );

    result = execSync(
      `docker build . -f build/Dockerfile -t ${packageJson.name}:${packageJson.version} --rm --no-cache`,
      { cwd: outDir }
    );
  } catch (e) {
    console.log(e);
  }

  fs.rmSync(outDir, { recursive: true, force: true }); */

  /* const outDir = path.resolve(`/tmp/${Math.round(Date.now() / 1000)}`);
  exec(`git clone ${argv.url} ${outDir}`, (err, out, errString) => {
    if (err) {
      console.log(errString);
      return;
    }

    console.log(out);

    fs.rmSync(outDir, { recursive: true, force: true });
    process.exit();
  });

  setInterval(() => console.log(1), 10000);
  console.log(argv); */
  const url = new URL("http://localhost:2375/v1.41/build");
  url.searchParams.append("dockerfile", "build/Dockerfile");
  url.searchParams.append("t", "tinjs-example:v0.1.0");
  url.searchParams.append("remote", argv.url);
  url.searchParams.append("rm", "true");

  const res = await fetch(url, { method: "POST" });

  for await (const chunk of res.body) {
    // console.dir(JSON.parse(chunk.toString()));
    try {
      // console.log(chunk.toString());
      // console.log(JSON.parse(chunk.toString()));
      const lines = chunk.toString().split("\n");

      for (const line of lines) {
        if (line && line !== "") {
          // console.log(line);
          const streamObj = JSON.parse(line);
          process.stdout.write(streamObj.stream || "");
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  /* return fetch(url, { method: "POST" })
    .then((res) => res.text())
    .then((res) => console.log(res)); */
};
