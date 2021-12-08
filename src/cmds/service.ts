import * as init from "./service_cmds/init";
import * as build from "./service_cmds/build";

export const command = "service <command> [options]";

export const desc = "init service directory";

export const builder = function (yargs) {
  return yargs
    .option("b", {
      alias: "baseDir",
      describe: "base directory",
      demandOption: true,
      default: ".",
    })
    .command(init)
    .command(build);
};

export const handler = (argv) => {
  console.log(argv);
};
