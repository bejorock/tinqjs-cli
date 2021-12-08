export * from "./cli";

const shutdown = () => {
  console.log("shutting down tinqjs server...");

  process.exit();
};

process.on("SIGINT", shutdown);
process.on("SIGHUP", shutdown);
process.on("SIGTERM", shutdown);

process.on("unhandledRejection", (reason, promise) => {
  console.log(reason);

  process.exit();
});
