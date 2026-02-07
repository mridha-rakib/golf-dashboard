import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";

import golflogo from "../../assets/logos/glfLogo.svg";

const SetNewPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleChange = (e) => {
    console.log(e.target.name);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // if (formData.newPassword.length < 8) {
    //   setError("Password must be at least 8 characters long");
    //   return;
    // }

    try {
      setError("");
      setLoading(true);
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would set the password via your backend
      // and then automatically log the user in
      const userData = {
        name: "New User",
        email: email,
        role: "user",
      };
      // login(userData, "mock-jwt-token");
      console.log(userData)
      navigate("/successful");
    } catch (err) {
      setError("Failed to set password. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/bgfill.png')] bg-cover bg-center p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto">
        <div className=" shadow-lg rounded-lg p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-center mb-2">
              <img
                src={golflogo}
                alt="golflogo"
                className="w-[250px] h-[150px]"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
              Set New Password
            </h2>
            <p className="text-center">
              Set a new password to secure your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                name="newPassword"
                type="password"
                id="password"
                placeholder="Enter your password"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full h-12 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
              />

              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1 mt-4"
              >
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full h-12 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 sm:h-12 bg-[#9D4C1D] text-white px-4 rounded-md cursor-pointer font-medium"
            >
              Next
            </button>

            <button
              type="button"
              onClick={()=>navigate("/login")}
              className="w-full h-12 px-4 rounded-md flex items-center justify-center gap-2 cursor-pointer text-gray-700  transition-colors"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} />
              <span className="font-medium">Back to Login</span>
            </button>
          </form>
        </div>
      </div>
    </div>

    // <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    //   <div className="max-w-md w-full space-y-8">
    //     <div>
    //       <div className="mx-auto h-12 w-auto flex justify-center">
    //         <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
    //           <span className="text-white font-bold text-xl">A</span>
    //         </div>
    //       </div>
    //       <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
    //         Set your password
    //       </h2>
    //       <p className="mt-2 text-center text-sm text-gray-600">
    //         Create a secure password for your account
    //       </p>
    //     </div>
    //     <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
    //       {error && (
    //         <div className="rounded-md bg-red-50 p-4">
    //           <div className="text-sm text-red-700">{error}</div>
    //         </div>
    //       )}

    //       <div className="rounded-md shadow-sm -space-y-px">
    //         <div className="relative">
    //           <label htmlFor="password" className="sr-only">
    //             Password
    //           </label>
    //           <input
    //             id="password"
    //             name="password"
    //             type={showPassword ? "text" : "password"}
    //             autoComplete="new-password"
    //             required
    //             className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
    //             placeholder="Password"
    //             value={formData.password}
    //             onChange={handleChange}
    //           />
    //           <button
    //             type="button"
    //             className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
    //             onClick={() => setShowPassword(!showPassword)}
    //           >
    //             {showPassword ? (
    //               <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    //               </svg>
    //             ) : (
    //               <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    //               </svg>
    //             )}
    //           </button>
    //         </div>
    //         <div className="relative">
    //           <label htmlFor="confirmPassword" className="sr-only">
    //             Confirm Password
    //           </label>
    //           <input
    //             id="confirmPassword"
    //             name="confirmPassword"
    //             type={showConfirmPassword ? "text" : "password"}
    //             autoComplete="new-password"
    //             required
    //             className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
    //             placeholder="Confirm Password"
    //             value={formData.confirmPassword}
    //             onChange={handleChange}
    //           />
    //           <button
    //             type="button"
    //             className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
    //             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    //           >
    //             {showConfirmPassword ? (
    //               <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    //               </svg>
    //             ) : (
    //               <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    //               </svg>
    //             )}
    //           </button>
    //         </div>
    //       </div>

    //       <div className="bg-blue-50 p-4 rounded-md">
    //         <h3 className="text-sm font-medium text-blue-800 mb-2">Password requirements</h3>
    //         <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
    //           <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
    //             At least 8 characters long
    //           </li>
    //           <li>Contains at least one number</li>
    //           <li>Contains at least one special character</li>
    //         </ul>
    //       </div>

    //       <div>
    //         <button
    //           type="submit"
    //           disabled={loading}
    //           className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    //         >
    //           {loading ? (
    //             <span className="flex items-center">
    //               <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    //                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    //                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    //               </svg>
    //               Setting up...
    //             </span>
    //           ) : 'Complete Registration'}
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>
  );
};

export default SetNewPassword;