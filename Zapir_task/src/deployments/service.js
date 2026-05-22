import { deployments } from "../data/deployments.js";

const VALID_STATUSES = new Set(["succeeded", "failed", "rolled_back"]);

export function listDeployments(filters = {}) {
  const { service, status } = filters;

  return deployments
    .filter((deployment) => {
      if (service && deployment.service !== service) {
        return false;
      }

      if (status && deployment.status !== status) {
        return false;
      }

      return true;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export function getDeploymentById(id) {
  return deployments.find((deployment) => deployment.id === id);
}

export function validateDeploymentFilters(filters = {}) {
  const errors = [];

  if (filters.status && !VALID_STATUSES.has(filters.status)) {
    errors.push({
      field: "status",
      message: `status must be one of: ${Array.from(VALID_STATUSES).join(", ")}`
    });
  }

  return errors;
}
