// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import extractErrorMessage from "../../lib/httpError";
import { useAuthStore } from "../../stores/authStore";

import bgImage from "../../assets/images/bg-image.jpg";
import mobile from "../../assets/images/mobile.png";
import glfLogo from "../../assets/logos/glfLogo.svg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to sign in. Please check your credentials."));
    }
  };

  const handleGoogleLogin = () => {};

  return (
    <div className="min-h-screen bg-white flex overflow-hidden text-[#5C526D]">
      {/* Left side - Mobile mockup - Hidden on mobile, visible on large screens */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center px-4 md:px-8 relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Shadow Overlay on Background */}
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

        {/* Content Above the Shadow */}
        <div className="relative z-10 flex flex-col items-center">
          <img
            src={mobile}
            alt="Decorative Art"
            className="h-[850px] w-[380px] rounded-2xl object-contain"
          />
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-8 bg-[url('/bgfill.png')] min-h-full bg-cover bg-center">
        <div className="w-full max-w-md mx-auto">
          <div className=" shadow-lg rounded-lg p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-center mb-2">
                <img
                  src={glfLogo}
                  alt="Rai Logo"
                  className="h-[158px] w-[205px] object-contain"
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 text-center">
                Welcome Back!
              </h2>
              <p className="text-sm sm:text-base text-center">
                To login, enter your email and password{" "}
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              {/* Login form */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    id="email"
                    value={formData.email}
                    placeholder="Enter your email"
                    onChange={handleChange}
                    className="w-full h-10 sm:h-12 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1"
                  >
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full h-10 sm:h-12 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your password"
                  />
                  <div className="text-right mt-1">
                    <button
                      type="button"
                      onClick={() => navigate("/forget-password")}
                      className="text-sm text-[#9D4C1D] cursor-pointer font-semibold"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full h-10 sm:h-12 bg-[#9D4C1D] text-white px-4 rounded-md cursor-pointer"
                >
                  Login
                </button>
              </div>
            </form>

            {/* Sign up link */}
            {/* <div className="text-center mt-6 font-semibold">
              <span>Don't have an account? </span>
              <button
                onClick={() => navigate("/signup")}
                className="text-[#9D4C1D] text-sm cursor-pointer font-semibold"
              >
                Create Account
              </button>
            </div> */}

            {/* Divider */}
            {/* <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50">Or</span>
              </div>
            </div> */}

            {/* Google login */}
            {/* <div className="flex items-center justify-center space-x-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-12 flex items-center justify-center gap-x-2 px-4 border border-gray-300 rounded-md shadow-sm  text-gray-700 hover:shadow-md cursor-pointer"
              >
                <img src={googleLogo} className="p-2" alt="googleLogo" />
                Google
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-12 flex items-center justify-center gap-x-2 px-4 border border-gray-300 rounded-md shadow-sm  text-gray-700 hover:shadow-md cursor-pointer"
              >
                <img src={usgaLogo} className="p-2" alt="usgaLogo" />
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;   
