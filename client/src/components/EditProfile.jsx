import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import TextInput from "./TextInput";
import Loading from "./Loading";
import CustomButton from "./CustomButton";
import { UpdateProfile } from "../redux/features/userSlice";

const EditProfile = () => {
  const { user } = useSelector((state) => state?.user);
  const [picture, setPicture] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", defaultValues: { ...user } });
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const onSubmit = async (data) => {};
  const handleClose = () => {
    dispatch(UpdateProfile(false));
  };
  const handleSelect = (e) => {
    setPicture(e.target.files[0]);
  };
  return (
    <>
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-[#000] opacity-70"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
          &#8203;
          <div
            className="inline-block align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="flex justify-between px-6 pt-5 pb-2">
              <label
                htmlFor="name"
                className="block font-medium text-xl text-ascent-1 text-left"
              >
                Edit Profile
              </label>
              <button className="text-ascent-1" onClick={handleClose}>
                <MdClose size={22} />
              </button>
            </div>
            <form
              className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6 pb-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextInput
                name="firstname"
                placeholder="Enter your first name"
                type="text"
                register={register("firstname", {
                  required: "First name is required",
                })}
                styles="w-full rounded"
                error={errors.firstname ? errors.firstname.message : ""}
              />
              <TextInput
                name="lastname"
                placeholder="Enter your last name"
                type="text"
                register={register("lastname", {
                  required: "Last name is required",
                })}
                styles="w-full rounded"
                error={errors.lastname ? errors.lastname.message : ""}
              />
              <TextInput
                name="location"
                placeholder="Enter your location"
                type="text"
                register={register("location", {
                  required: "Location is required",
                })}
                styles="w-full rounded"
                error={errors.location ? errors.location.message : ""}
              />
              <TextInput
                name="profession"
                placeholder="Enter your profession"
                type="text"
                register={register("profession", {
                  required: "Profession is required",
                })}
                styles="w-full rounded"
                error={errors.profession ? errors.profession.message : ""}
              />
              <label
                htmlFor="imgUpload"
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
              >
                <input
                  type="file"
                  onChange={(e) => handleSelect(e.target.files[0])}
                  className=""
                  id="imgUpload"
                  accept=".jpg, .png, .jpeg"
                />
              </label>
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
              <div className="py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]">
                {isSubmitting ? (
                  <Loading />
                ) : (
                  <CustomButton
                    type="submit"
                    containerStyles={`inline-flex justify-center outline-none rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                    title="Update Profile"
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
