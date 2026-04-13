const express = require("express");
const app = express();

const http = require("http").createServer(app);
const { Server } = require("socket.io");
const path = require("path");

const io = new Server(http, {
    cors: { origin: "*" }
});

// ★ 状態保持（重要）
let currentColor = "red";
let currentMode = "normal";

app.use(express.static("."));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "display", "index.html"));
});

io.on("connection", (socket) => {
    console.log("connected");

    // ★ 接続時に現在状態を送る
    socket.emit("changeColor", currentColor);
    socket.emit("mode", currentMode);

    socket.on("changeColor", (color) => {
        currentColor = color;
        console.log("color:", color);
        io.emit("changeColor", color);
    });

    socket.on("mode", (mode) => {
        currentMode = mode;
        console.log("mode:", mode);
        io.emit("mode", mode);
    });
});

http.listen(3000, "0.0.0.0", () => {
    console.log("サーバー起動");
});
    console.log("サーバー起動");
});
