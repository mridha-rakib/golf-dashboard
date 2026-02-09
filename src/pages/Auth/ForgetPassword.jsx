import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import golflogo from "../../assets/logos/glfLogo.svg";

import { toast } from "react-toastify";
import { formatErrorMessage } from "../../lib/httpError";

function ForgetPassword() {
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
 
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleNext = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Password reset code sent to your email");
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error(
        formatErrorMessage(
          err,
          "Failed to send reset code. Please try again.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/bgfill.png')] bg-cover bg-center p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto">
        <div className=" shadow-lg rounded-lg p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-center">
              <img src={golflogo} alt="golflogo" className="w-[250px] h-[150px]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 text-center">
              Forgot Password
            </h2>
            <p className="text-sm sm:text-base text-center">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleNext}



            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            {/* Next button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#9D4C1D] text-white px-4 rounded-md cursor-pointer font-medium disabled:opacity-60"
            >
              {isLoading ? "Sending..." : "Next"}
            </button>

            {/* Back to Login */}
            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full h-12 px-4 rounded-md flex items-center justify-center gap-2 cursor-pointer text-gray-700  transition-colors"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} />
              <span className="font-medium">Back to Login</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
