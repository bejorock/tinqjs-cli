import { logger } from "./logger";

export * from "./cli";

const shutdown = () => {
  logger.info("shutting down tinqjs server...");

  process.exit();
};

process.on("SIGINT", shutdown);
process.on("SIGHUP", shutdown);
process.on("SIGTERM", shutdown);

process.on("unhandledRejection", (reason: any, promise) => {
  logger.error(reason);
  logger.error(reason.stack);

  process.exit();
});
