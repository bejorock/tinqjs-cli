#!/usr/bin/env node
require("source-map-support").install();

import yargs from "yargs/yargs";
import * as init from "./cmds/init";
import * as service from "./cmds/service";
import * as start from "./cmds/start";
import * as clone from "./cmds/clone";

yargs(process.argv.slice(2))
  .command(init)
  .command(service)
  .command(start)
  .command(clone)
  .demandCommand()
  .help().argv;
