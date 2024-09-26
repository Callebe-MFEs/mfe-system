import createApplication from "./application";
import http from "http";

const PORT = process.env.HTTP_PORT || 3000;
const LOG_FORMAT = process.env.LOG_FORMAT || "dev";

(async () => {
  const application = await createApplication(LOG_FORMAT);
  const server = http.createServer(application);

  server.listen(PORT, () => {
    console.log(`Server is listening on :${PORT}`);
  });
})();
