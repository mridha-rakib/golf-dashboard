// src/pages/auth/Signup.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
import mobile from "../../assets/images/mobile.png";
import glfLogo from "../../assets/logos/glfLogo.svg";
import bgImage from "../../assets/images/bg-image.jpg";

const Signup = () => {
  const location = useLocation();
  const role = location.state?.role || "club"; // fallback role if not provided
  console.log("Selected role:", role);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (formData.email && formData.password && formData.password === formData.confirmPassword) {
        const userData = {
          name: "John Doe",
          email: formData.email,
          role: role, // attach the role from selection
        };
        // login(userData, "mock-jwt-token");
        navigate("/");
      } else if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
      } else {
        setError("Please fill in all fields");
      }
    } catch (err) {
      setError("Failed to sign up. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden text-[#5C526D]">
      {/* Right side - Signup form */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-8 bg-[url('/bgfill.png')] min-h-full bg-cover bg-center">
        <div className="w-full max-w-md mx-auto">
          <div className="shadow-lg rounded-lg p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-center mb-2">
                <img
                  src={glfLogo}
                  alt="GLF Logo"
                  className="h-[158px] w-[205px] object-contain"
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 text-center">
                Create an Account ({role})
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-md bg-red-50 p-4 mb-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              {/* Form fields */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
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
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full h-10 sm:h-12 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                    Confirm Password
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className="w-full h-10 sm:h-12 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 sm:h-12 bg-[#9D4C1D] text-white px-4 rounded-md hover:bg-[#885c43] cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
              </div>
            </form>

            {/* Login link */}
            <div className="text-center mt-6 font-semibold">
              <span>Already have an account? </span>
              <button
                onClick={() => navigate("/login")}
                className="text-[#9D4C1D] font-semibold text-sm cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Left side - Mobile mockup */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center px-4 md:px-8 relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

        <div className="relative z-10 flex flex-col items-center">
          <img
            src={mobile}
            alt="Decorative Art"
            className="h-[850px] w-[380px] rounded-2xl object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;