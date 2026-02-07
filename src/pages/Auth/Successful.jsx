import React from "react";
// import { RaiLogo, GoogleLogo, Back, Tick } from "../../icons/Logo";
import { useNavigate } from "react-router-dom";
import golflogo from "../../assets/logos/glfLogo.svg";
import tick from "../../assets/logos/tick.svg";
function Successful() {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/bgfill.png')] bg-cover bg-center p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto">
        <div className=" shadow-lg rounded-lg p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-center mb-2">
                <img src={golflogo} alt="golflogo" className="w-[250px] h-[150px]" />
            </div>
            <div className="flex justify-center mt-6 sm:mt-8">
                <img src={tick} alt="tick" className="w-[55px] h-[55px]" />
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-xl sm:text-2xl font-semibold text-gray-800">Successful</p>
            <p className="text-gray-600 mt-2">Your password has been set successfully.</p>
          </div>

          <button
            onClick={handleBackToLogin}
            className="w-full h-12 flex justify-center items-center gap-2 text-white mt-8 px-4 rounded-md bg-[#5700FE] hover:bg-[#003bfece] cursor-pointer font-medium transition-colors"
          >
           
            <span>Back to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Successful;