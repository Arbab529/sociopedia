import { Outlet, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Home, Login, Register, ResetPassword, Profile } from "./pages";
import { useSelector } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";

function Layout() {
  const { user } = useSelector((state) => state?.user);
  const location = useLocation();
  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

function App() {
  const theme = useSelector((state) => state?.theme);
  return (
    <ErrorBoundary
      fallback={
        <div className="w-full h-[100vh] flex items-center justify-center flex-col">
          <h1 className="text-lg">Something went Wrong!</h1>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="bg-[#0444a4] text-white px-6 py-2.5 mt-4 rounded-full"
          >
            Reload Page
          </button>
        </div>
      }
    >
      <div data-theme={theme?.theme} className="w-full min-h-[100vh]">
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
    </ErrorBoundary>
  );
}

export default App;
