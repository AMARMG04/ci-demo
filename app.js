const express = require("express");
const app = express();

app.get("/", (req, res) => res.json({ status: "ok" }));
app.get("/health", (req, res) => res.send("healthy as fuck"));

module.exports = app;
