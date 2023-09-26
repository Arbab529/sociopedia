import { useState } from "react";
import { Outlet, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Home, Login, Register, ResetPassword, Profile } from "./pages";
import { useSelector } from "react-redux";

function Layout() {
  const user = useSelector((state) => state?.user);
  const location = useLocation();
  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate path="/login" replace state={{ from: location }} />
  );
}

function App() {
  const theme = useSelector((state) => state?.theme);
  console.log(theme);
  return (
    <div date-theme={theme} className="w-full min-h-[100vh]">
      <Routes>
        {/* All Protected Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id?" element={<Profile />} />
        </Route>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
