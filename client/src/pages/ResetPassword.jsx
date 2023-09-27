import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loading from "../components/Loading";
import CustomButton from "../components/CustomButton";
import TextInput from "../components/TextInput";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const onSubmit = async (data) => {};

  return (
    <div className="w-full h-[100vh] bg-bgColor flex items-center justify-center p-6">
      <div className="bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg">
        <p className="text-ascent-1 text-lg font-semibold">Email Address</p>
        <span className="text-sm text-ascent-2">
          Enter your registered email address
        </span>
        <form
          className="py-4 flex gap-5 flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInput
            name="email"
            placeholder="Enter your email address"
            type="email"
            register={register("email", {
              required: "Email address is required",
            })}
            styles="w-full rounded"
            labelStyle="ml-2"
            error={errors.email ? errors.email.message : ""}
          />
          {errMsg?.message && (
            <span
              className={`${
                errMsg.status === "failed"
                  ? "text-[#f64949fe]"
                  : "text-[#2ba150fe]"
              }`}
            >
              {errMsg?.message}
            </span>
          )}
          {isSubmitting ? (
            <Loading />
          ) : (
            <CustomButton
              type="submit"
              containerStyles={`inline-flex justify-center outline-none rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
              title="Submit"
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
