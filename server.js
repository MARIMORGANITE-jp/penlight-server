const express = require("express");
const app = express();

const http = require("http").createServer(app);

const { Server } = require("socket.io");

const io = new Server(http, {
    cors: {
        origin: "*"
    }
});

// =========================
// HTML公開
// =========================
app.use(express.static(__dirname));

// =========================
// 状態保持
// =========================
let currentColor = "#ff0000";
let currentMode = "normal"; // normal / blink / rainbow
let isForceLive = false;
let isPowerOn = true;
let brightness = 100;

// =========================
// 接続
// =========================
io.on("connection", (socket) => {

    console.log(`connected : ${socket.id}`);

    // 新規接続時に現在状態を同期
    socket.emit("changeColor", currentColor);
    socket.emit("mode", currentMode);
    socket.emit("forceLive", isForceLive);
    socket.emit("power", isPowerOn);
    socket.emit("brightness", brightness);

    // -------------------------
    // 色変更
    // -------------------------
    socket.on("changeColor", (color) => {

        if (typeof color !== "string") return;

        currentColor = color;

        io.emit("changeColor", currentColor);

        console.log("color:", currentColor);
    });

    // -------------------------
    // モード変更
    // -------------------------
    socket.on("mode", (mode) => {

        const modes = ["normal", "blink", "rainbow"];

        if (!modes.includes(mode)) return;

        currentMode = mode;

        io.emit("mode", currentMode);

        console.log("mode:", currentMode);
    });

    // -------------------------
    // 強制ライブ
    // -------------------------
    socket.on("forceLive", (state) => {

        isForceLive = !!state;

        io.emit("forceLive", isForceLive);

        console.log("forceLive:", isForceLive);
    });

    // -------------------------
    // 点灯 / 消灯
    // -------------------------
    socket.on("power", (state) => {

        isPowerOn = !!state;

        io.emit("power", isPowerOn);

        console.log("power:", isPowerOn);
    });

    // -------------------------
    // 明るさ
    // -------------------------
    socket.on("brightness", (value) => {

        brightness = Number(value);

        if (Number.isNaN(brightness)) return;

        brightness = Math.max(0, Math.min(100, brightness));

        io.emit("brightness", brightness);

        console.log("brightness:", brightness);
    });

    // -------------------------
    // 状態再同期
    // -------------------------
    socket.on("requestState", () => {

        socket.emit("changeColor", currentColor);
        socket.emit("mode", currentMode);
        socket.emit("forceLive", isForceLive);
        socket.emit("power", isPowerOn);
        socket.emit("brightness", brightness);

    });

    // -------------------------
    // 切断
    // -------------------------
    socket.on("disconnect", () => {

        console.log(`disconnected : ${socket.id}`);

    });

});

// =========================
// 起動
// =========================
const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {

    console.log("====================================");
    console.log(" Fks Penlight Server Started");
    console.log(` http://localhost:${PORT}`);
    console.log("====================================");

});
