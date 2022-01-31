import fetch from "node-fetch";
import { logger } from "../logger";

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
  const url = new URL("http://localhost:2375/v1.41/build");
  url.searchParams.append("dockerfile", "build/Dockerfile");
  url.searchParams.append("t", "tinjs-example:v0.1.0");
  url.searchParams.append("remote", argv.url);
  url.searchParams.append("rm", "true");

  const res = await fetch(url, { method: "POST" });

  for await (const chunk of res.body) {
    try {
      const lines = chunk.toString().split("\n");

      for (const line of lines) {
        if (line && line !== "") {
          const streamObj = JSON.parse(line);
          process.stdout.write(streamObj.stream || "");
        }
      }
    } catch (e) {
      logger.error(e);
    }
  }
};
