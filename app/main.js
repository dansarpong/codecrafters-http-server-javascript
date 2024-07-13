const net = require("net"),
      fs = require("fs");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString().split("\r\n");

    if (request[0].startsWith("GET / ")) {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");

    } else if (request[0].startsWith("GET /echo/")) {
      let content = request[0].split(" ")[1].split("/")[2];
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`);

    } else if (request[0].startsWith("GET /user-agent ")) {
      let content = request[2].split(" ")[1];
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`);

    } else if (request[0].startsWith("GET /files/")) {
      let filename = request[0].split(" ")[1].substring(7);
      let directory = process.argv[3];

      if (fs.existsSync(directory + filename)) {
        const file = fs.readFileSync(directory + filename)
        socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${file.length}\r\n\r\n${file}`);
      } else {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      }

    } else if (request[0].startsWith("POST /files/")) {
      let filename = request[0].split(" ")[1].substring(7);
      let directory = process.argv[3];
      let content = request[request.length - 1];

      fs.writeFileSync(directory + filename, content);
      socket.write("HTTP/1.1 201 Created\r\n\r\n");

    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }

  });
  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");
