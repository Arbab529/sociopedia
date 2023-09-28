import React, { useState } from "react";
import { TbSocial } from "react-icons/tb";
import TextInput from "../components/TextInput";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loading from "../components/Loading";
import CustomButton from "../components/CustomButton";
import { bgImage } from "../assets";
import { BsShare } from "react-icons/bs";
import { ImConnection } from "react-icons/im";
import { AiOutlineInteraction } from "react-icons/ai";
import { registerUser } from "../utils";

const Register = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await registerUser(data);
      console.log(res);
      if (res?.status === "failed") {
        setErrMsg(res);
      } else {
        setErrMsg(res);
        setTimeout(() => {
          window.location.replace("/login");
        }, 6000);
      }
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bgColor w-full h-[100vh] flex items-center justify-center p-6">
      <div className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-full py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl">
        {/* Left */}
        <div className="hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-[#065ad8]">
          <div className="relative w-full flex items-center justify-center">
            <img
              src={bgImage}
              alt="Bg Image"
              className="w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover"
            />
            <div className="absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full">
              <BsShare size={14} />
              <span className="text-xs font-medium">Share </span>
            </div>
            <div className="absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full">
              <ImConnection size={14} />
              <span className="text-xs font-medium">Conenct </span>
            </div>
            <div className="absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full">
              <AiOutlineInteraction size={14} />
              <span className="text-xs font-medium">Interact </span>
            </div>
          </div>
          <div className="mt-16 text-center">
            <p className="text-white text-base">
              Connect with friends & have share for fun.
            </p>
            <span className="text-sm text-white/80">
              Share memories with friends and the world.
            </span>
          </div>
        </div>

        {/* Right  */}
        <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center">
          <div className="w-full flex gap-2 items-center mb-6">
            <div className="p-2 bg-[#065ad8] rounded text-white">
              <TbSocial />
            </div>
            <span className="text-2xl text-[#065ad8] font-semibold">
              Sociopedia
            </span>
          </div>
          <p className="text-ascent-1 text-base font-semibold">
            Create your account
          </p>
          <form
            className="py-8 flex gap-5 flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col lg:flex-row gap-1 md:gap-2">
              <TextInput
                name="firstname"
                placeholder="Enter your first name"
                label="First Name"
                type="text"
                register={register("firstname", {
                  required: "First name is required",
                })}
                styles="w-full rounded"
                labelStyle="ml-2"
                error={errors.firstname ? errors.firstname.message : ""}
              />
              <TextInput
                name="lastname"
                placeholder="Enter your last name"
                label="Last Name"
                type="text"
                register={register("lastname", {
                  required: "Last name is required",
                })}
                styles="w-full rounded"
                labelStyle="ml-2"
                error={errors.lastname ? errors.lastname.message : ""}
              />
            </div>
            <TextInput
              name="email"
              placeholder="Enter your email address"
              label="Email Address"
              type="email"
              register={register("email", {
                required: "Email address is required",
              })}
              styles="w-full rounded"
              labelStyle="ml-2"
              error={errors.email ? errors.email.message : ""}
            />
            <div className="flex flex-col lg:flex-row gap-1 md:gap-2">
              <TextInput
                name="password"
                placeholder="Enter you password"
                label="Password"
                type="password"
                register={register("password", {
                  required: "Password is required",
                })}
                styles="w-full rounded"
                labelStyle="ml-2"
                error={errors.password ? errors.password.message : ""}
              />
              <TextInput
                name="confirmpassword"
                placeholder="Confirm password"
                label="Confirm Password"
                type="password"
                register={register("confirmpassword", {
                  required: "Confirm Password is required",
                  validate: (value) => {
                    const { password } = getValues();
                    if (password != value) {
                      return "Password do not match";
                    }
                  },
                })}
                styles="w-full rounded"
                labelStyle="ml-2"
                error={
                  errors.confirmpassword &&
                  errors.confirmpassword.type === "validate"
                    ? errors.confirmpassword?.message
                    : ""
                }
              />
            </div>

            {errMsg?.message && (
              <span
                className={`${
                  errMsg?.status === "failed"
                    ? "text-[#1a1a1afe] bg-[#ff8d8dfe] px-3 py-2"
                    : " text-[#1a1a1afe] bg-[#8effb2fe] px-3 py-2"
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
                title="Create Account"
              />
            )}
          </form>
          <div className="text-ascent-2 text-sm text-center">
            Already have an account?
            <Link
              to="/login"
              className="text-[#065ad8] font-semibold ml-2 cursor-pointer"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
