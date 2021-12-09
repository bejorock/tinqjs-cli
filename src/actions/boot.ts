import path from "path";
import fs from "fs";
import esbuild from "esbuild";

import createHttpServer from "./createHttpServer";
import createService from "./createService";
import { BootOptions, ModuleConfig, Service } from "../types";
import liveReload from "./liveReload";
import { ChildProcess } from "child_process";

export function bootService(
  service: Service,
  config: ModuleConfig,
  urlPaths: any
) {
  const cp = createService(service, config);

  if (config.http) {
    // wait for http socket

    cp.once("message", ({ type, socketPath }: any) => {
      // console.log(type);
      if (type === "http init") urlPaths[config.http.basePath] = socketPath;
      else if (type === "shutdown") {
        // reboot service
        delete urlPaths[config.http.basePath];

        process.nextTick(() => {
          bootService(service, config, urlPaths);
        });
      }
      // console.log(urlPaths);
    });
  }

  return cp;
}

export default function boot({ services, http }: BootOptions) {
  const urlPaths: any = {};
  const cps: { [key: string]: ChildProcess } = {};

  for (const service of services) {
    const configPath = path.resolve(
      service.rootDir,
      "tinqjs-service.config.json"
    ); //require.resolve(service + "/tinqjs-service.config.js");
    const config: ModuleConfig = {
      srcDir: "src",
      outDir: "dist",
      entryPoints: ["index.ts"],
      rootDir: service.rootDir,
      ...JSON.parse(fs.readFileSync(configPath, "utf-8")),
    };

    if (!config.enabled) continue;

    const cp = bootService(service, config, urlPaths);

    // check if need live reload
    if (config.liveReload) {
      // prepare file watcher
      liveReload(config, (result: esbuild.BuildResult) => {
        if (cps[service.name]) {
          console.log(`Reload module ${service.name}`);
          if (cps[service.name].connected)
            cps[service.name].send({ type: "shutdown" });

          delete cps[service.name];

          cps[service.name] = bootService(service, config, urlPaths);
        }
      });
    }

    cps[service.name] = cp;
  }

  const httpServer = createHttpServer(urlPaths);

  httpServer.listen(http.port, () => {
    console.log(`Http server started at ${http.host}:${http.port}`);
  });

  console.log(`server ready!`);
}
