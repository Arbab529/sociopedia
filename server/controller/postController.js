const User = require("../model/userModel");
const asyncErrorhandler = require("express-async-handler");
const Post = require("../model/postModel");
const Comment = require("../model/commentModel");

const createPost = asyncErrorhandler(async (req, res, next) => {
  const { userId } = req.body.user;
  const { description, image } = req.body;
  if (!description) {
    next("Please provide a description");
    return;
  }
  const post = await Post.create({
    userId,
    description,
    image,
  });
  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: post,
  });
  try {
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

const getPosts = asyncErrorhandler(async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { search } = req.body;
    const user = await User.findById(userId);
    const friends = user?.friends.toString().split(",") ?? [];
    friends.push(userId);
    const searchPostQuery = {
      $or: [
        {
          description: { $regex: search, $options: "i" },
        },
      ],
    };
    const posts = await Post.find(search ? searchPostQuery : {})
      .populate({
        path: "userId",
        select: "firstname lastname profileUrl location -password",
      })
      .sort({
        _id: -1,
      });
    const friendsPost = posts.filter((post) => {
      return friends.includes(post?.userId?._id.toString());
    });
    const otherPost = posts.filter((post) => {
      return !friends.includes(post?.userId?._id.toString());
    });
    let postsRes = null;
    if (friendsPost.length > 0) {
      postsRes = search ? friendsPost : [...friendsPost, otherPost];
    } else {
      postsRes = posts;
    }
    res.status(200).json({
      success: true,
      message: "Success",
      data: postsRes,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const getSinglePost = asyncErrorhandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate({
      path: "userId",
      select: "firstname lastname profileUrl location -password",
    });
    //   .populate({
    //     path: "comments",
    //     populate: {
    //       path: "userId",
    //       select: "firstname lastname profileUrl location -password",
    //     },
    //     options: {
    //       sort: "-_id",
    //     },
    //   })
    //   .populate({
    //     path: "comments",
    //     populate: {
    //       path: "replies.userId",
    //       select: "firstname lastname profileUrl location -password",
    //     },
    //   });
    res.status(200).json({
      success: true,
      message: "Success",
      data: post,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const getUserPost = asyncErrorhandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    // const { userId } = req.body.user;
    const post = await Post.find({ userId: id })
      // const post = await Post.find({ userId: userId })
      .populate({
        path: "userId",
        select: "firstname lastname profileUrl location -password",
      })
      .sort({ _id: -1 });

    res.status(200).json({
      success: true,
      message: "Success",
      data: post,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const getComments = asyncErrorhandler(async (req, res, next) => {
  try {
    const { postId } = req.params;
    const postComments = await Comment.find({ postId })
      .populate({
        path: "userId",
        select: "firstname lastname profileUrl location -password",
      })
      .populate({
        path: "replies.userId",
        select: "firstname lastname profileUrl location -password",
      })
      .sort({ _id: -1 });

    res.status(200).json({
      success: true,
      message: "Success",
      data: postComments,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const likePost = asyncErrorhandler(async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;
    const post = await Post.findById(id);
    const index = post?.likes?.findIndex((pid) => pid === String(userId));
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter((pid) => pid !== String(userId));
    }
    const newPost = await Post.findByIdAndUpdate(id, post, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Successfully",
      data: newPost,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const likeComment = asyncErrorhandler(async (req, res, next) => {
  const { userId } = req.body.user;
  const { id, rid } = req.params;
  try {
    if (rid === null || rid === undefined || rid === "false") {
      const comment = await Comment.findById(id);
      const index = comment?.likes?.findIndex((el) => el === String(userId));
      if (index === -1) {
        comment.likes.push(userId);
      } else {
        comment.likes = comment.likes.filter((i) => i !== String(userId));
      }
      const updated = await Comment.findByIdAndUpdate(id, comment, {
        new: true,
      });
      res.status(201).json(updated);
    } else {
      const replyComment = await Comment.findOne(
        { _id: id },
        {
          replies: {
            $elemMatch: {
              _id: rid,
            },
          },
        }
      );
      const index = replyComment?.replies[0]?.likes.findIndex(
        (i) => i === String(userId)
      );
      if (index === -1) {
        replyComment.replies[0].likes.push(userId);
      } else {
        replyComment.replies[0].likes = replyComment.replies[0]?.likes.filter(
          (i) => i !== String(userId)
        );
      }
      const query = { _id: id, "replies._id": rid };
      const updated = {
        $set: {
          "replies.$.likes": replyComment.replies[0].likes,
        },
      };
      const result = await Comment.updateOne(query, updated, { new: true });
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const commentPost = asyncErrorhandler(async (req, res, next) => {
  const { comment, from } = req.body;
  const { userId } = req.body.user;
  const { id } = req.params;
  try {
    if (comment === null) {
      res.status(201).json({ success: false, message: "Comment is required" });
    }
    const newComment = new Comment({ comment, from, userId, postId: id });
    await newComment.save();

    const post = await Post.findById(id);
    post.comments.push(newComment._id);

    const updateComment = await Post.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(newComment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const replyPostComment = asyncErrorhandler(async (req, res, next) => {
  const { comment, from, replyAt } = req.body;
  const { userId } = req.body.user;
  const { id } = req.params;
  try {
    if (comment === null) {
      res.status(201).json({ success: false, message: "Comment is required" });
    }
    const commentInfo = await Comment.findById(id);
    commentInfo.replies.push({
      comment,
      replyAt,
      from,
      userId,
      created_At: Date.now(),
    });
    commentInfo.save();
    res.status(200).json(commentInfo);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
const deletePost = asyncErrorhandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    await Post.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = {
  createPost,
  getPosts,
  getSinglePost,
  getUserPost,
  getComments,
  likePost,
  likeComment,
  commentPost,
  replyPostComment,
  deletePost,
};
