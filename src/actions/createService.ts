import { ChildProcess, fork } from "child_process";
import fs from "fs";
import path from "path";
import { ModuleConfig, Service } from "../types";

export default function createService(
  service: Service,
  config: ModuleConfig
): ChildProcess {
  const packageConfig = JSON.parse(
    fs.readFileSync(path.resolve(service.rootDir, "package.json"), "utf-8")
  );

  const mainPath = config.main
    ? path.resolve(service.rootDir, config.main)
    : path.resolve(service.rootDir, packageConfig.main);

  const cp = fork(mainPath, [service.name], {
    env: { CHILD: "true" },
    cwd: service.rootDir,
  });

  /* return new Promise((resolve, reject) => {
    cp.once("message", ({ socketPath }: any) => {
      resolve([cp, socketPath]);
    });
  }); */

  return cp;
}
