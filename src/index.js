const http = require("http");
const { handler } = require("./handlerRoutes");

const server = http.createServer(handler);

server.listen(3333, () => console.log("server running"));

process.on("uncaughtException", (error) =>
  console.log(`Error in server: ${error}`)
);
