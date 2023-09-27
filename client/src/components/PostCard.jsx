import React, { useState } from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import moment from "moment";
import { BiSolidLike, BiLike, BiComment } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import CommentForm from "./CommentForm";
import Loading from "./Loading";
import { postComments } from "../assets/data";
import { BsFillCaretLeftSquareFill } from "react-icons/bs";
import ReplyCard from "./ReplyCard";

const PostCard = ({ post, user, deletePost, likePost }) => {
  const [showAll, setShowAll] = useState(0);
  const [showReply, setShowReply] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyComments, setReplyComments] = useState(0);
  const [showComments, setShowComments] = useState(0);
  const getComments = async () => {
    setReplyComments(0);
    setComments(postComments);
    setLoading(false);
  };
  const handleLike = async () => {};
  return (
    <div className="mb-2 bg-primary p-4 rounded-xl border border-[#66666645]">
      <div className="flex gap-3 items-center mb-2">
        <Link to={"/profile/" + post?.userId?._id}>
          <img
            src={post?.userId?.profileUrl ?? NoProfile}
            alt={post?.userId?.firstName}
            className="w-10 h-10 object-cover rounded-full"
          />
        </Link>
        <div className="w-full flex justify-between">
          <div>
            <Link to={"/profile/" + post?.userId._id}>
              <p className="font-medium text-lg text-ascent-1">
                {post?.userId?.firstName} {post?.userId?.lastName}
              </p>
              <span className="text-ascent-2">{post?.userId?.location}</span>
            </Link>
          </div>
          <span className="text-ascent-2">
            {moment(post?.createdAt ?? "2023-05-05").fromNow()}
          </span>
        </div>
      </div>
      <div>
        <p className="text-ascent-2">
          {showAll === post?._id
            ? post?.description
            : post?.description.slice(0, 300)}

          {post?.description?.length > 301 &&
            (showAll === post?._id ? (
              <span
                className="text-blue ml-2 font-medium cursor-pointer"
                onClick={() => setShowAll(0)}
              >
                Show Less
              </span>
            ) : (
              <span
                className="text-blue ml-2 font-medium cursor-pointer"
                onClick={() => setShowAll(post?._id)}
              >
                Show More
              </span>
            ))}
        </p>
        {post?.image && (
          <img
            src={post?.image}
            alt="Post Image"
            className="w-full mt-2 rounded-lg"
          />
        )}
      </div>
      <div className="mt-4 flex justify-between items-center px-3 pt-3 pb-1 text-ascent-2 text-base border-t border-[#66666645]">
        <p className="flex gap-2 items-center text-base cursor-pointer">
          {post?.likes?.includes(user?._id) ? (
            <BiSolidLike size={20} color="blue" />
          ) : (
            <BiLike size={20} />
          )}
          {post?.likes?.length} Likes
        </p>
        <p
          className="flex gap-2 items-center text-base cursor-pointer"
          onClick={() => {
            setShowComments(showComments === post?._id ? null : post._id);
            getComments(post?._id);
          }}
        >
          <BiComment size={20} />
          {post?.comments?.length}
        </p>
        {user?._id === post?.userId?.id && (
          <div
            className="flex gap-1 items-center text-base text-ascent-1 cursor-pointer"
            onClick={() => deletePost(post?._id)}
          >
            <MdOutlineDeleteOutline size={20} />
            <span>Delete</span>
          </div>
        )}
      </div>
      {showComments === post?._id && (
        <div className="w-full mt-4 border-t border-[#66666645] pt-4">
          <CommentForm
            user={user}
            id={post?._id}
            getComments={() => getComments(post._id)}
          />
          {loading ? (
            <Loading />
          ) : comments?.length > 0 ? (
            comments?.map((comment) => (
              <div className="w-full py-2" key={comment?._id}>
                <div className="flex gap-3 items-center mb-1">
                  <Link to={"/profile/" + comment?.userId?._id}>
                    <img
                      src={comment?.userId?.profileUrl ?? NoProfile}
                      alt={comment?.userId?.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>
                  <Link to={"/profile/" + comment?.userId?._id}>
                    <p className="font-medium text-base text-ascent-1">
                      {comment?.userId?.firstName} {comment?.userId?.lastName}
                    </p>
                  </Link>
                  <span className="text-ascent-2 text-sm">
                    {moment(comment?.createdAt ?? "2023-05-25").fromNow()}
                  </span>
                </div>
                <div className="ml-12">
                  <p className="text-ascent-2">{comment?.comment}</p>
                  <div className="mt-2 flex gap-3">
                    <p className="flex gap-2 items-center text-base text-ascent-2 cursor-pointer">
                      {comment?.likes?.includes(user?.id) ? (
                        <BiSolidLike size={20} color="blue" />
                      ) : (
                        <BiLike size={20} />
                      )}
                      {comment?.likes?.length} Likes
                    </p>
                    <span
                      className="text-blue cursor-pointer"
                      onClick={() => setReplyComments(comment?._id)}
                    >
                      Reply
                    </span>
                  </div>
                  {replyComments === comment?._id && (
                    <CommentForm
                      user={user}
                      id={comment?._id}
                      replyAt={comment?.from}
                      getComments={() => getComments(post?._id)}
                    />
                  )}
                </div>
                <div className="py-2 px-8 mt-6">
                  {comment?.replies?.length > 0 && (
                    <p
                      className="text-base text-ascent-1 cursor-pointer"
                      onClick={() => {
                        setShowReply(
                          showReply === comment?.replies?._id
                            ? 0
                            : comment?.replies?._id
                        );
                      }}
                    >
                      Show Replies ({comment?.replies?.length})
                    </p>
                  )}
                  {showReply === comment?.replies?._id &&
                    comment?.replies?.map((reply) => (
                      <ReplyCard
                        reply={reply}
                        user={user}
                        key={reply?._id}
                        handleLike={() =>
                          handleLike(
                            "/posts/like-comment/" +
                              comment?._id +
                              "/" +
                              reply?._id
                          )
                        }
                      />
                    ))}
                </div>
              </div>
            ))
          ) : (
            <span className="flex text-sm py-4 text-ascent-2 text-center">
              No Comments, be first to comment
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
