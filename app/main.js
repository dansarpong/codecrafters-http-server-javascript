const net = require("net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString().split("\r\n")[0];
    if (request.startsWith("GET / ")) {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else if (request.startsWith("GET /echo/")) {
      const content = request.split(" ")[1].split("/")[1];
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`)
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
  });
  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");
