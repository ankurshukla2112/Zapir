import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
const server = createApp();

server.on("error", (error) => {
  console.error(`Unable to start deployment events API: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, () => {
  console.log(`Deployment events API listening on http://localhost:${port}`);
});
