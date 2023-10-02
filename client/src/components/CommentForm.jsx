import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { NoProfile } from "../assets";
import TextInput from "./TextInput";
import Loading from "./Loading";
import CustomButton from "./CustomButton";
import { PostComment } from "../utils";

const CommentForm = ({ user, id, getComments, replyAt }) => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const onSubmit = async (data) => {
    setLoading(true);
    setErrMsg("");
    try {
      const URL = !replyAt
        ? "/posts/comment/" + id
        : "/posts/reply-comment/" + id;
      const newData = {
        comment: data?.comment,
        from: user?.firstname + " " + user?.lastname,
        replyAt,
      };
      const res = await PostComment(URL, newData, user?.token);
      if (res?.status === "failed") {
        setErrMsg(res);
        setLoading(false);
      } else {
        reset({
          comment: "",
        });
        setErrMsg("");
        await getComments();
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full border-b border-[#66666645]"
    >
      <div className="w-full flex items-center gap-2 py-4">
        <img
          src={user?.profileUrl ?? NoProfile}
          alt="User Image"
          className="w-10 h-10 rounded-full object-cover"
        />
        <TextInput
          name="comment"
          placeholder={replyAt ? `Reply @${replyAt}` : "Comment this post"}
          register={register("comment", {
            required: "Comment cannot be empty",
          })}
          styles="w-full rounded-full py-3"
          error={errors.comment ? errors.comment.message : ""}
        />
      </div>
      {errMsg?.message && (
        <span
          className={`${
            errMsg.status === "failed" ? "text-[#f64949fe]" : "text-[#2ba150fe]"
          }`}
        >
          {errMsg?.message}
        </span>
      )}
      <div className="flex items-end justify-end pb-2">
        {loading ? (
          <Loading />
        ) : (
          <CustomButton
            type="submit"
            containerStyles={`bg-[#0444a4] text-white py-1 px-3 rounded-full font-semibold text-sm`}
            title="Comment"
          />
        )}
      </div>
    </form>
  );
};

export default CommentForm;
