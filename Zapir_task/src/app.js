import { createServer } from "node:http";
import {
  getDeploymentById,
  listDeployments,
  validateDeploymentFilters
} from "./deployments/service.js";
import { sendJson, sendMethodNotAllowed, sendNotFound } from "./http/response.js";

export function createApp() {
  return createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

    if (req.method !== "GET") {
      sendMethodNotAllowed(res);
      return;
    }

    if (url.pathname === "/health") {
      sendJson(res, 200, { status: "ok" });
      return;
    }

    if (url.pathname === "/deployments") {
      const filters = {
        service: url.searchParams.get("service") ?? undefined,
        status: url.searchParams.get("status") ?? undefined
      };
      const errors = validateDeploymentFilters(filters);

      if (errors.length > 0) {
        sendJson(res, 400, {
          error: {
            code: "invalid_filters",
            message: "One or more filters are invalid",
            details: errors
          }
        });
        return;
      }

      const data = listDeployments(filters);

      sendJson(res, 200, {
        data,
        meta: {
          count: data.length,
          filters
        }
      });
      return;
    }

    const deploymentMatch = url.pathname.match(/^\/deployments\/([^/]+)$/);

    if (deploymentMatch) {
      const deployment = getDeploymentById(decodeURIComponent(deploymentMatch[1]));

      if (!deployment) {
        sendNotFound(res, "Deployment not found");
        return;
      }

      sendJson(res, 200, { data: deployment });
      return;
    }

    sendNotFound(res);
  });
}
