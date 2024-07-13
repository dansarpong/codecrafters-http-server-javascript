const net = require("net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString().split("\r\n");

    if (request[0].startsWith("GET / ")) {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else if (request[0].startsWith("GET /echo/")) {
      const content = request[0].split(" ")[1].split("/")[2];
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`)
    } else if (request[0].startsWith("GET /user-agent ")) {
      const content = request[2].split(" ")[1];
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`)
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }

  });
  socket.on("close", () => {
    socket.end();
    socket.close();
  });
});

server.listen(4221, "localhost");
