const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const {
  createPost,
  getPosts,
  getSinglePost,
  getUserPost,
  likePost,
  likeComment,
  commentPost,
  replyPostComment,
  deletePost,
  getComments,
} = require("../controller/postController");

router.post("/create-post", userAuth, createPost);
router.get("/", userAuth, getPosts);
router.get("/:id", userAuth, getSinglePost);
// router.get("/get-user-post/", userAuth, getUserPost);
router.get("/get-user-post/:id", userAuth, getUserPost);
router.get("/comments/:postId", userAuth, getComments);

router.post("/likes/:id", userAuth, likePost);
router.post("/like-comment/:id/:rid?", userAuth, likeComment);
router.post("/comment/:id", userAuth, commentPost);
router.post("/reply-comment/:id", userAuth, replyPostComment);
router.delete("/:id", userAuth, deletePost);

module.exports = router;
