import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize({
      all: true,
    }),
    winston.format.label({ label: "tinqjs-cli" }),
    winston.format.timestamp({
      format: "DD-MM-YY hh:mm:ss",
    }),
    winston.format.printf(
      (info) =>
        `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
    )
  ),
  defaultMeta: "tinqjs-cli",
  transports: [new winston.transports.Console()],
});
