import axios from "axios";
import { base_url } from "./config";
import { SetPosts } from "../redux/features/postSlice";
import { SetSuggestedFriends } from "../redux/features/userSlice";

export const API = axios.create({
  baseURL: base_url,
  responseType: "json",
});

export const apiRequest = async ({ url, token, data, method }) => {
  try {
    const result = await API(url, {
      method: method || "GET",
      data: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return result?.data;
  } catch (error) {
    const err = error.response.data;
    console.log(err);
    return { status: err.success, message: err.message };
  }
};

export const handleFileUpload = async (uploadFile) => {
  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("upload_preset", "socialmedia");
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload/`,
      formData
    );
    return response?.data?.secure_url;
  } catch (error) {
    console.log(error);
  }
};

export const registerUser = async (data) => {
  try {
    const res = await apiRequest({
      url: "/auth/register",
      method: "POST",
      data: data,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (data) => {
  try {
    const res = await apiRequest({
      url: "/auth/login",
      method: "POST",
      data: data,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const resetPassword = async (data) => {
  try {
    const res = await apiRequest({
      url: "/users/request-passwordreset",
      method: "POST",
      data: data,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (token, data) => {
  try {
    const res = await apiRequest({
      url: "/users/update-user",
      token: token,
      method: "PUT",
      data: data || {},
    });
    return res;
  } catch (error) {}
};

export const createPost = async (uri, token, data) => {
  try {
    const res = await apiRequest({
      url: uri || "/posts",
      token: token,
      method: "POST",
      data: data || {},
    });
    return res;
  } catch (error) {}
};

export const fetchPosts = async (uri, token, data, dispatch) => {
  try {
    const res = await apiRequest({
      url: uri || "/posts",
      token: token,
      method: "GET",
      data: data || {},
    });
    dispatch(SetPosts(res?.data));
    return;
  } catch (error) {}
};

export const likePost = async ({ uri, token }) => {
  try {
    // /posts/likes/<postID>
    const res = await apiRequest({
      url: uri,
      token: token,
      method: "POST",
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (id, token) => {
  try {
    const res = await apiRequest({
      url: "/posts/" + id,
      token: token,
      method: "DELETE",
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

export const getPostComments = async (id, token) => {
  try {
    const res = await apiRequest({
      url: "/posts/comments/" + id,
      token: token,
      method: "GET",
    });
    return res?.data;
  } catch (error) {
    console.log(error);
  }
};
export const PostComment = async (url, data, token) => {
  try {
    const res = await apiRequest({
      url: url,
      token: token,
      method: "POST",
      data: data,
    });
    return res;
  } catch (error) {}
};

export const getUserInfo = async (id, token) => {
  try {
    const uri = id === undefined ? "/users/get-user" : "/users/get-user/" + id;
    const res = await apiRequest({
      url: uri,
      token: token,
      method: "GET",
    });
    if (res?.message === "Authentication failed") {
      localStorage.removeItem("user");
      window.alert("User Session expired. Login again");
      window.location.replace("/login");
    }
    return res?.user;
  } catch (error) {
    console.log(error);
  }
};

export const fetchSuggestedFriends = async (token, dispatch) => {
  try {
    const res = await apiRequest({
      url: "/users/suggested-friends",
      token: token,
      method: "GET",
    });
    dispatch(SetSuggestedFriends(res?.data));

    return res?.data;
  } catch (error) {}
};

export const sendFriendRequest = async (id, token) => {
  try {
    const res = await apiRequest({
      url: "/users/friend-request",
      token: token,
      method: "POST",
      data: { requestTo: id },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getFriendRequest = async (token) => {
  try {
    const res = await apiRequest({
      url: "/users/get-friend-request",
      token: token,
      method: "GET",
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const acceptFriendRequest = async (token, id, status) => {
  try {
    const res = await apiRequest({
      url: "/users/accept-request",
      token: token,
      method: "POST",
      data: { rid: id, status },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const viewUserProfile = async (id, token) => {
  try {
    const res = await apiRequest({
      url: "/users/profile-view",
      token: token,
      method: "POST",
      data: { id },
    });
    return;
  } catch (error) {
    console.log(error);
  }
};
