import http from "http";
import httpProxy from "http-proxy";

import { logger } from "../logger";

const getSocketPath = (
  urlPaths: string[],
  client_req: http.IncomingMessage
) => {
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

  return socketPath;
};

export default function createHttpServer(urlPaths: string[]) {
  const proxy = httpProxy.createProxyServer({ ws: true });

  const forwarder =
    (socketPath: string) =>
    (req, res, counter = 5) => {
      proxy.web(
        req,
        res,
        {
          target: { socketPath } as any,
        },
        (err) => {
          logger.error(err);

          if (counter - 1 > 0)
            setTimeout(() => forwarder(socketPath)(req, res, counter - 1), 100);
          else {
            res.statusCode = 500;
            res.end("Server not ready");
          }
        }
      );
    };

  proxy.on("error", (err) => console.log(err));
  const server = http.createServer((client_req, client_res) => {
    const socketPath = getSocketPath(urlPaths, client_req);
    if (socketPath) {
      const forward = forwarder(socketPath);

      forward(client_req, client_res);
      /* proxy.web(
        client_req,
        client_res,
        {
          target: { socketPath: socketPath } as any,
        },
        (err) => {
          console.log(err);
          logger.error(err);

          client_res.statusCode = 500;
          client_res.end("Server not ready");
        }
      ); */
    } else {
      client_res.statusCode = 404;
      client_res.end("Page Not Found");
    }
  });

  server.on("upgrade", (client_req, socket, head) => {
    const socketPath = getSocketPath(urlPaths, client_req);
    // console.log(client_req.url, socketPath);
    if (socketPath)
      proxy.ws(
        client_req,
        socket,
        head,
        { target: { socketPath: socketPath } as any },
        (err) => {
          logger.error(err);

          socket.end();
        }
      );
    else socket.end();
  });

  /* const server = http.createServer((client_req, client_res) => {
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

        proxy.on("error", (err) => {
          logger.error(err);

          client_res.statusCode = 500;
          client_res.end("Service is not ready");
        });
        // proxy.on("close", () => console.log("connection closed"));
        // proxy.on("socket", () => console.log("socket connected"));

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
  }); */

  return server;
}
