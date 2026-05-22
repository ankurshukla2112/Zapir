export function sendJson(res, statusCode, body) {
  const payload = JSON.stringify(body);

  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
    "Connection": "close"
  });
  res.end(payload);
}

export function sendNotFound(res, message = "Route not found") {
  sendJson(res, 404, {
    error: {
      code: "not_found",
      message
    }
  });
}

export function sendMethodNotAllowed(res) {
  sendJson(res, 405, {
    error: {
      code: "method_not_allowed",
      message: "Only GET requests are supported for this endpoint"
    }
  });
}
