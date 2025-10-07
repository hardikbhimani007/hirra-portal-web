import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MuiOtpInput } from 'mui-one-time-password-input';
import { verifyUser } from "../services/userService";

import onboardImage from "../assets/images/Onboard.png";
import onboardbackground from "../assets/images/Onboardbackground.png";
import logo from "../assets/images/logo.png";
import phoneicon from "../assets/images/iphone16.png";

const Otp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const userType = location.state?.userType || searchParams.get("type");
  const email = location.state?.email || searchParams.get("email");
  const authType = location.state?.authType || searchParams.get("authType");

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  const handleVerify = async () => {
    if (otp.length < 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);

    try {
      const phoneOrEmail = location.state?.phoneOrEmail || searchParams.get("phoneOrEmail");
      const isEmail = /\S+@\S+\.\S+/.test(phoneOrEmail);

      const payload = isEmail
        ? { email: phoneOrEmail, otp }
        : { phone: phoneOrEmail, otp };

      const res = await verifyUser(payload);

      if (res?.success) {
        toast.success("OTP verified successfully!");
        const profileStatus = res.data?.profile_status;
        await localStorage.setItem("usertype", res.data?.user_type);
        await localStorage.setItem("username", res.data?.name);
        await localStorage.setItem("user_id", res.data?.id);
        await localStorage.setItem("profilepictures", res.data?.profile_pictures);

        setTimeout(() => {
          if (authType === "login") {
            if (profileStatus === "completed") {
              if (userType === "tradesperson") navigate("/tradesperson/jobs");
              else if (userType === "subcontractor") navigate("/subcontractor/jobs");
              else if (userType === "admin") navigate("/admin/jobs");
              else navigate("/");
            } else {
              if (userType === "tradesperson") navigate("/tradeInfo");
              else if (userType === "subcontractor") navigate("/subcontractorInfo");
              else if (userType === "admin") navigate("/admin/jobs");
              else navigate("/");
            }
          } else if (authType === "register") {
            if (profileStatus === "completed") {
              if (userType === "tradesperson") navigate("/tradesperson/jobs");
              else if (userType === "subcontractor") navigate("/subcontractor/jobs");
              else if (userType === "admin") navigate("/admin/jobs");
              else navigate("/");
            } else {
              if (userType === "tradesperson") navigate("/tradeInfo");
              else if (userType === "subcontractor") navigate("/subcontractorInfo");
              else if (userType === "admin") navigate("/admin/jobs");
              else navigate("/");
            }
          }
        }, 800);
      } else {
        toast.error(res?.message || "Invalid OTP, please try again.");
      }
    } catch (err) {
      console.error("OTP Verify Error:", err);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (canResend) {
      toast.info("OTP resent!");
      setTimer(30);
      setCanResend(false);
      setOtp('');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full p-2 md:p-5 bg-gray-100 overflow-hidden">
      <div className="hidden lg:flex flex-[1110] h-full items-center justify-center rounded-[20px] xl:rounded-[30px] overflow-hidden">
        <img src={onboardImage} alt="Onboarding illustration" className="w-full h-full object-cover" />
      </div>

      <div
        className="flex-[750] lg:mt-0 flex items-center justify-center rounded-[20px] xl:rounded-[30px] lg:ml-5 bg-cover bg-center relative h-full lg:h-full"
        style={{ backgroundImage: `url(${onboardbackground})` }}
      >
        <div className="absolute inset-0 bg-white/80 rounded-[20px] xl:rounded-[30px]" />

        <div className="w-full max-w-[95%] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[85%] xl:max-w-[520px] relative z-10 flex flex-col h-full justify-between p-4 sm:p-5 md:p-6 lg:p-5 xl:p-8 rounded-xl">
          <div className="flex items-center justify-center py-4">
            <img
              src={logo}
              alt="Logo"
              className="w-[140px] sm:w-[180px] md:w-[200px] lg:w-[180px] xl:w-[220px] 2xl:w-[240px] h-auto"
            />
          </div>

          <div className="flex-1 flex flex-col justify-center py-4 sm:py-6">
            <h2 className="font-semibold text-[24px] sm:text-[28px] md:text-[32px] lg:text-[28px] xl:text-[32px] 2xl:text-[36px] text-center text-[#1A202C] mb-3 sm:mb-4">
              Enter your code
            </h2>

            <div className="mb-2">
              <MuiOtpInput
                value={otp}
                onChange={handleChange}
                length={6}
                autoFocus
                TextFieldsProps={{
                  placeholder: '-',
                  type: 'number',
                }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center', // centers all OTP boxes
                  gap: { xs: 1.5, sm: 1.5 },
                  '& .MuiTextField-root': {
                    minWidth: '40px',
                    maxWidth: '62px',
                  },
                  '& input': {
                    textAlign: 'center',
                    fontSize: { xs: '14px', sm: '15px', md: '16px' },
                    fontWeight: 500,
                    height: { xs: '20px', sm: '20px', md: '20px' },
                  },
                  '& .MuiOutlinedInput-root': {
                    justifyContent: 'center',
                    borderRadius: '10px',
                    '& fieldset': {
                      borderColor: '#D8DDE6',
                    },
                    '&:hover fieldset': {
                      borderColor: '#D8DDE6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#152A45',
                      borderWidth: '2px',
                    },
                  },
                }}
              />

            </div>

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-[#152A45] text-white py-3 my-[10px] rounded-lg font-medium hover:bg-[#2d3748] transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <p className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-[#718096]">
                Didn't get it?{" "}
                <button
                  onClick={handleResend}
                  disabled={!canResend}
                  className={`text-[14px] cursor-pointer sm:text-[15px] md:text-[16px] ${canResend
                    ? "text-blue-600 hover:underline"
                    : "text-gray-400 cursor-not-allowed"
                    } font-medium`}
                >
                  Resend
                </button>
              </p>

              {timer > 0 && (
                <span className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-[#718096]">
                  00:{timer < 10 ? `0${timer}` : timer}
                </span>
              )}
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

export default Otp;