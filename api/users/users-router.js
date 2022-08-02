const express = require("express");
const Users = require("./users-model");
const Posts = require("../posts/posts-model");

const {
  logger,
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware");

const router = express.Router();

function rootGetHandler(req, res, next) {
  Users.get(req.query)
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => next({ error }));
}

router.get("/", logger, rootGetHandler);

router.get("/:id", logger, validateUserId, (req, res) => {
  res.json(req.existingUser);
});

router.post("/", logger, validateUser, (req, res, next) => {
  Users.insert(req.user)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => next({ error }));
});

router.put("/:id", logger, validateUser, validateUserId, (req, res, next) => {
  Users.update(req.params.id, req.user)
    .then(() => {
      res.status(200).json({ ...req.existingUser, ...req.user });
    })
    .catch((error) => next({ error }));
});

router.delete("/:id", logger, validateUserId, (req, res, next) => {
  Users.remove(req.existingUser.id)
    .then(() => {
      res.status(200).json(req.existingUser);
    })
    .catch((error) => next({ error }));
});

router.get("/:id/posts", logger, validateUserId, (req, res, next) => {
  Users.getUserPosts(req.params.id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => next({ error }));
});

router.post("/:id/posts", validateUserId, validatePost, (req, res, next) => {
  const postInfo = { ...req.body, user_id: req.params.id };

  Posts.insert(postInfo)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => next({ error }));
});

module.exports = router;
