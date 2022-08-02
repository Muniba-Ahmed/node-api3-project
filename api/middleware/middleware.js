const Users = require("../users/users-model");

function logger(req, res, next) {
  req.timestamp = new Date();
  console.log(`
  METHOD: ${req.method}, 
  URL: ${req.baseUrl}, 
  TS: ${req.timestamp}
  `);
  next();
}

function validateUserId(req, res, next) {
  Users.getById(req.params.id).then((user) => {
    if (user) {
      req.existingUser = user;
      next();
    } else {
      res.status(404).json({ message: "user not found" });
    }
  });
}

function validateUser(req, res, next) {
  if (typeof req.body.name != "string" || req.body.name.trim() == "") {
    res.status(400).json({ message: "missing required name field" });
    return;
  }
  req.user = { name: req.body.name.trim() };
  next();
}

function validatePost(req, res, next) {
  let { text } = req.body;

  if (!text) {
    res.status(400).json({ message: "missing required text field" });
    return;
  }
  next();
}

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
};
