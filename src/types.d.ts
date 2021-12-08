export interface Module {
  name: string;
  rootDir: string;
}

export interface Service extends Module {
  options?: any;
}

export interface Lib extends Module {}

export declare type HttpOptions = {
  host: string;
  port: number;
};

export declare type BootOptions = {
  services?: Service[];
  http?: HttpOptions;
};

export declare type MainConfig = {
  libs?: string;
  services?: string;
  http?: HttpOptions;
};

export declare type ModuleConfig = {
  name?: string;
  main?: string;
  entryPoints?: string[];
  rootDir?: string;
  srcDir?: string;
  outDir?: string;
  noBuild?: boolean;
  liveReload?: boolean;
  enabled?: boolean;
  http?: { basePath: string; routeDir: string };
};
