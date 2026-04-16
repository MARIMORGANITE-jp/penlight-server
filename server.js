const express = require("express");
const app = express();

const http = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(http, {
    cors: { origin: "*" }
});

// 👇これが重要
app.use(express.static(__dirname + "/display"));
app.use("/control", express.static(__dirname + "/control"));

io.on("connection", (socket) => {
    console.log("connected");

    socket.on("changeColor", (color) => {
        console.log("color:", color);
        io.emit("changeColor", color);
    });
});

http.listen(3000, "0.0.0.0", () => {
    console.log("サーバー起動");
});
