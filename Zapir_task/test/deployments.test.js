import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { createApp } from "../src/app.js";

describe("deployment events API", () => {
  let server;
  let baseUrl;

  before(async () => {
    server = createApp();
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", resolve);
    });
    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    server.closeAllConnections();
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it("lists deployments with metadata", async () => {
    const response = await fetch(`${baseUrl}/deployments`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.meta.count, 30);
    assert.equal(body.data.length, 30);
  });

  it("filters deployments by service and status", async () => {
    const response = await fetch(
      `${baseUrl}/deployments?service=billing-api&status=failed`
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.meta.count, 2);
    assert.ok(
      body.data.every(
        (deployment) =>
          deployment.service === "billing-api" && deployment.status === "failed"
      )
    );
  });

  it("returns a single deployment by id", async () => {
    const response = await fetch(`${baseUrl}/deployments/deploy_001`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.data.id, "deploy_001");
  });

  it("returns 404 for an unknown deployment", async () => {
    const response = await fetch(`${baseUrl}/deployments/deploy_missing`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.error.code, "not_found");
  });

  it("returns 400 for an invalid status filter", async () => {
    const response = await fetch(`${baseUrl}/deployments?status=unknown`);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error.code, "invalid_filters");
  });
});
