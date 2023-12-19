const http = require("http");
const port = process.env.PORT || 5500;
const app = require("./app");

const server = http.createServer(app);
server.listen(port, () => console.log("Running Server at " + port));
