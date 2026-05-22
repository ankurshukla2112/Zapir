# Deployment Events API

A small dependency-free Node.js API that serves seeded deployment event data for interview pre-work.

## Requirements

- Node.js 20 or newer

## Run Locally

```bash
npm start
```

The API starts on `http://localhost:3000`.

Keep this terminal running. Open a second terminal tab/window for the `curl` commands below.

Use a different port if needed:

```bash
PORT=4000 npm start
```

## Endpoints

### `GET /health`

Returns a simple health check.

```json
{
  "status": "ok"
}
```

### `GET /deployments`

Lists deployment events. Supports optional `service` and `status` filters.

Examples:

```bash
curl "http://localhost:3000/deployments"
curl "http://localhost:3000/deployments?service=billing-api"
curl "http://localhost:3000/deployments?status=failed"
curl "http://localhost:3000/deployments?service=billing-api&status=failed"
```

Response shape:

```json
{
  "data": [
    {
      "id": "deploy_006",
      "service": "billing-api",
      "status": "failed",
      "duration": 289,
      "timestamp": "2025-05-12T19:20:00Z",
      "commit_sha": "f6a7b8c"
    }
  ],
  "meta": {
    "count": 1,
    "filters": {
      "service": "billing-api",
      "status": "failed"
    }
  }
}
```

Valid statuses are `succeeded`, `failed`, and `rolled_back`.

### `GET /deployments/:id`

Returns a single deployment event.

```bash
curl "http://localhost:3000/deployments/deploy_001"
```

Response shape:

```json
{
  "data": {
    "id": "deploy_001",
    "service": "billing-api",
    "status": "succeeded",
    "duration": 184,
    "timestamp": "2025-04-21T09:15:00Z",
    "commit_sha": "a1b2c3d"
  }
}
```

Unknown deployment ids return:

```json
{
  "error": {
    "code": "not_found",
    "message": "Deployment not found"
  }
}
```

## Test

```bash
npm test
```

## Troubleshooting

If `curl` shows `Failed to connect to localhost port 3000`, the API server is not running on port `3000`.

Start it first:

```bash
npm start
```

You should see:

```text
Deployment events API listening on http://localhost:3000
```

Then, in a second terminal, run the `curl` command again.

curl "http://localhost:3000/deployments?service=billing-api&status=failed"
curl "http://localhost:3000/deployments/deploy_001"

## Project Structure

```text
src/
  app.js                    # HTTP routing and response handling
  server.js                 # Local server entry point
  data/deployments.js       # Seeded deployment events
  deployments/service.js    # Query and validation logic
  http/response.js          # JSON response helpers
test/
  deployments.test.js       # Sanity tests for core API behavior
```
