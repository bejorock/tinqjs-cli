import http from "http";
import { logger } from "../logger";

export default function createHttpServer(urlPaths: string[]) {
  const server = http.createServer((client_req, client_res) => {
    const sortedPaths = Object.keys(urlPaths)
      .sort((a, b) => b.split("/").length - a.split("/").length)
      .map((key) => ({ basePath: key, socketPath: urlPaths[key] }));
    // const urlTokens = client_req.url.split("/").filter((p) => p !== "");

    let socketPath = null;
    for (const p of sortedPaths) {
      if (client_req.url.startsWith(p.basePath)) {
        socketPath = p.socketPath;

        break;
      }
    }

    if (socketPath) {
      try {
        const proxy = http.request(
          {
            socketPath: socketPath,
            path: client_req.url,
            method: client_req.method,
            headers: client_req.headers,
          },
          (res) => {
            client_res.writeHead(res.statusCode, res.headers);
            res.pipe(client_res, {
              end: true,
            });
          }
        );

        client_req.pipe(proxy, {
          end: true,
        });
      } catch (err) {
        logger.error(err);
        client_res.statusCode = 500;
        client_res.end("Service not ready");
      }
    } else {
      client_res.statusCode = 404;
      client_res.end("Page Not Found");
    }
  });

  return server;
}
