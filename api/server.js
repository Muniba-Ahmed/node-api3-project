const express = require("express");
const userRouter = require("./users/users-router");

const server = express();

server.use(express.json());

server.use("/api/users", userRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Error retrieving the users",
    stack: err.error.stack,
  });
});

module.exports = server;
