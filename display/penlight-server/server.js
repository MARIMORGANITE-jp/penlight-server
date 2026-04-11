const express = require("express");
const app = express();

const http = require("http").createServer(app);
const { Server } = require("socket.io");
const path = require("path");

const io = new Server(http, {
    cors: { origin: "*" }
});

app.use(express.static("."));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "display", "index.html"));
});

io.on("connection", (socket) => {
    console.log("connected");

    socket.on("changeColor", (color) => {
        console.log("color:", color); 
        io.emit("changeColor", color);
    });
});

http.listen(3000, () => {
    console.log("サーバー起動");
});