import http from "node:http";

import { toJson } from "./middlewares/toJson.js";
import { extractQueryParams } from "./utils/extractQueryParams.js";
import { routes } from "./routes/index.js";

const PORT = 3333;

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await toJson(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = extractQueryParams(query);

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(PORT, () => console.log("server running on port", PORT));
