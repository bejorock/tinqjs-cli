#!/usr/bin/env node
require("source-map-support").install();

import yargs from "yargs/yargs";
import * as init from "./cmds/init";
import * as service from "./cmds/service";
import * as start from "./cmds/start";

yargs(process.argv.slice(2))
  .command(init)
  .command(service)
  .command(start)
  .demandCommand()
  .help().argv;
