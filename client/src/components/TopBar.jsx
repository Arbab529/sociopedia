import React, { useState } from "react";
import { TbSocial } from "react-icons/tb";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import CustomButton from "../components/CustomButton";
import { useForm } from "react-hook-form";
import TextInput from "./TextInput";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SetTheme } from "../redux/features/themeSlice";
import { Logout } from "../redux/features/userSlice";
import { fetchPosts } from "../utils";

const TopBar = () => {
  const { theme } = useSelector((state) => state?.theme);
  const { user } = useSelector((state) => state.user);
  const { posts: initalPosts } = useSelector((state) => state.posts);
  const [posts, setPosts] = useState(initalPosts);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSearch = async (data) => {
    console.log(data);
  };
  const fetchPost = async (data) => {
    await fetchPosts("", user?.token, data, dispatch);
    setIsSubmitting(false);
  };

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue));
  };
  return (
    <div className="topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary">
      <Link to="/" className="flex gap-2 items-center">
        <div className="p-1 md:p-2 bg-[#065ad8] rounded text-white">
          <TbSocial />
        </div>
        <span className=" text-xl md:test-2xl text-[#065ad8] font-semibold">
          Sociopedia
        </span>
      </Link>
      <form
        onSubmit={handleSubmit(handleSearch)}
        className="hidden md:flex items-center justify-center"
      >
        <TextInput
          placeholder="Search..."
          styles="w-[18rem] lg:w-[38rem] rounded-l-full py-3"
          register={register("search")}
        />
        <CustomButton
          title="Search"
          type="submit"
          containerStyles="bg-[#0444a4] text-white px-6 py-2.5 mt-1 rounded-r-full"
        />
      </form>
      <div className="flex gap-4 items-center text-ascent-1 text-md md:text-xl">
        <button onClick={() => handleTheme()}>
          {theme === "light" ? <BsMoon /> : <BsSunFill />}
        </button>
        <div className="hidden lg:flex">
          <IoMdNotificationsOutline />
        </div>
        <CustomButton
          onClick={() => dispatch(Logout())}
          title="Logout"
          type="submit"
          containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
        />
      </div>
    </div>
  );
};

export default TopBar;
