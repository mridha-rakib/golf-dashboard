// src/pages/auth/VerifyOtp.jsx
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import golflogo from "../../assets/logos/glfLogo.svg";
import { formatErrorMessage } from "../../lib/httpError";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && !e.target.value && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, ""); // Only digits

    if (pastedData.length > 0) {
      const newOtp = [...otp];



      // Fill input fields with pasted digits
      for (let i = 0; i < Math.min(pastedData.length, 4); i++) {
        newOtp[i] = pastedData[i];
      }

      setOtp(newOtp);

      // Focus the next empty field or the last field if all are filled
      const nextEmptyIndex = newOtp.findIndex((digit) => digit === "");
      if (nextEmptyIndex !== -1) {
        document.getElementById(`otp-${nextEmptyIndex}`).focus();
      } else {
        document.getElementById("otp-3").focus(); // Focus last field (4th input)
      }


    }


  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      setError("Please enter the 4-digit code");
      return;
    }

    try {
      setError("");
console.log(email, otpValue);
      setIsVerifying(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Code verified successfully");
      navigate("/set-password", { state: { email, resetCode: otpValue } });
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError(formatErrorMessage(err, "Invalid verification code"));
    } finally {
      setIsVerifying(false);
    }


  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <img src={golflogo} alt="golf Logo" className="w-24 h-24" />




            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
              Verify Code
            </h2>
            <p className="text-center text-gray-600">
              Enter the verification code sent to {email}
            </p>
          </div>

          {/* OTP Inputs */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              className="flex flex-row gap-2 items-center justify-center"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e)}
                  className="w-12 h-12 text-center text-lg px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#FFD1E8] focus:border-[#FFD1E8]"
                  required
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Next Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full h-12 bg-[#9D4C1D] hover:bg-gray-800 text-white px-4 rounded-lg cursor-pointer font-medium transition-colors disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>









            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 flex items-center justify-center gap-2 cursor-pointer text-gray-700 hover:bg-gray-50 transition-colors"
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
    //         <div className=" flex items-center justify-center">
    //           <img src={golflogo} alt="golflogo" className="w-[250px] h-[150px]" />
    //         </div>
    //       </div>
    //       <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
    //         Verify your account
    //       </h2>
    //       <p className="mt-2 text-center text-sm text-gray-600">
    //         We've sent a verification code to {email}
    //       </p>
    //     </div>
    //     <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
    //       {error && (
    //         <div className="rounded-md bg-red-50 p-4">
    //           <div className="text-sm text-red-700">{error}</div>
    //         </div>
    //       )}

    //       <div>
    //         <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
    //           Verification Code
    //         </label>
    //         <div className="flex justify-between space-x-2">
    //           {otp.map((data, index) => (
    //             <input
    //               key={index}
    //               id={`otp-${index}`}
    //               type="text"
    //               maxLength="1"
    //               className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    //               value={data}
    //               onChange={e => handleChange(e.target, index)}
    //               onKeyDown={e => handleKeyDown(e, index)}
    //               onFocus={e => e.target.select()}
    //             />
    //           ))}
    //         </div>
    //       </div>

    //       <div className="text-center">
    //         {canResend ? (
    //           <button
    //             type="button"
    //             onClick={handleResendOtp}
    //             disabled={loading}
    //             className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    //           >
    //             Resend verification code
    //           </button>
    //         ) : (
    //           <p className="text-sm text-gray-600">
    //             Resend code in {countdown} seconds
    //           </p>
    //         )}
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
    //               Verifying...
    //             </span>
    //           ) : 'Verify Account'}
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>
  );
};

export default VerifyOtp;
