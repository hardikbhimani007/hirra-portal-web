import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import onboardImage from "../assets/images/Onboard.png";
import phoneicon from "../assets/images/iphone16.png";
import onboardbackground from "../assets/images/Onboardbackground.png";
import logo from "../assets/images/logo.png";
import subcontractor from "../assets/icons/subcontractor.svg";
import tradeperson from "../assets/icons/tradeperson.svg";

const Signup = () => {
  const [userType, setUserType] = useState(() => localStorage.getItem("userType") || "");
  const navigate = useNavigate();

  const handleJoinAs = (type) => {
    setUserType(type);
    localStorage.setItem("userType", type);
    navigate(`/signup?type=${type}`, { state: { authType: "register" } });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full p-4 md:p-5 bg-gray-100 overflow-hidden">
      <div className="hidden lg:flex flex-[1110] h-full items-center justify-center rounded-[20px] xl:rounded-[30px] overflow-hidden">
        <img
          src={onboardImage}
          alt="Onboarding illustration"
          className="w-full h-[100%] object-cover"
        />
      </div>

      <div
        className="flex-[750] lg:mt-0 flex items-center justify-center rounded-[20px] xl:rounded-[30px] lg:ml-5 bg-cover bg-center relative h-full lg:h-full"
        style={{ backgroundImage: `url(${onboardbackground})` }}
      >
        <div className="absolute inset-0 bg-white/80 rounded-[20px] xl:rounded-[30px]" />
        <div className="w-full max-w-[90%] max-[768px]:w-full max-[1025px]:w-[60%] max-[1440px]:w-[100%] min-[1441px]:w-[72%] relative z-10 flex flex-col h-full justify-between p-5 sm:p-6 md:p-8 rounded-xl">

          <div className="flex items-center justify-center py-4">
            <img
              src={logo}
              alt="Logo"
              className="w-[140px] sm:w-[180px] md:w-[200px] lg:w-[180px] xl:w-[220px] 2xl:w-[240px] h-auto"
            />
          </div>

          <div className="flex-1 flex flex-col justify-center py-4">
            <h3 className="font-inter font-semibold text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl 2xl:text-[32px] text-center mb-6 text-[#1A202C]">
              Join as a Tradespeople or Subcontractors
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
              <button
                type="button"
                onClick={() => setUserType("tradesperson")}
                className={`relative p-4 rounded-lg border-2 flex flex-col items-start justify-start space-y-2 min-h-[85px] cursor-pointer 
                  ${userType === "tradesperson" ? "border-[#1A202C] bg-gray-50" : "border-gray-300 hover:border-gray-400"}`}
              >
                <span className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${userType === "tradesperson" ? "border-[#1A202C]" : "border-gray-400"}`}>
                  {userType === "tradesperson" && (
                    <span className="w-2.5 h-2.5 bg-[#1A202C] rounded-full" />
                  )}
                </span>
                <div className="flex flex-col items-start space-y-2 text-start">
                  <img src={tradeperson} alt="Tradesperson" className="w-8 sm:w-10 lg:w-8 xl:w-10 2xl:w-12 h-auto" />
                  <span className="text-sm sm:text-base font-medium text-[#1A202C]">I'm a Tradesperson</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUserType("subcontractor")}
                className={`relative p-4 rounded-lg border-2 flex flex-col items-start justify-start space-y-2 min-h-[85px] cursor-pointer 
                  ${userType === "subcontractor" ? "border-[#1A202C] bg-gray-50" : "border-gray-300 hover:border-gray-400"}`}
              >
                <span className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${userType === "subcontractor" ? "border-[#1A202C]" : "border-gray-400"}`}>
                  {userType === "subcontractor" && (
                    <span className="w-2.5 h-2.5 bg-[#1A202C] rounded-full" />
                  )}
                </span>
                <div className="flex flex-col items-start space-y-2 text-start">
                  <img src={subcontractor} alt="Subcontractor" className="w-8 sm:w-10 lg:w-8 xl:w-10 2xl:w-12 h-auto" />
                  <span className="text-sm sm:text-base font-medium text-[#1A202C]">I'm a Subcontractor</span>
                </div>
              </button>
            </div>

            <div className="flex justify-center mb-6">
              <button
                onClick={() => userType && handleJoinAs(userType)}
                disabled={!userType}
                className={`w-full sm:w-[220px] md:w-[240px] lg:w-full xl:w-[240px] h-[45px] flex items-center justify-center rounded-md font-medium transition-all cursor-pointer
                  ${userType ? "bg-[#152A45] hover:bg-gray-900 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                {userType
                  ? `Join as a ${userType === "tradesperson" ? "Tradesperson" : "Subcontractor"}`
                  : "Join as a..."}
              </button>
            </div>
          </div>

          <div className="text-center py-4">
            <div className="inline-flex items-start text-xs sm:text-sm text-gray-600">
              <img
                src={phoneicon}
                alt="Hirra Logo"
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 relative top-[2px]"
              />
              <p className="m-0 ml-[4px]">
                Install Hirra to your Home Screen for quick access.{' '}
                <button className="text-blue-600 text-xs sm:text-sm font-medium hover:underline cursor-pointer">
                  Add
                </button>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
