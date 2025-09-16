const express = require("express");
const app = express();

app.get("/", (req, res) => res.json({ status: "ok" }));
app.get("/health", (req, res) => res.send("healthy"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening ${port}`));

module.exports = app; // for tests
