import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { insertUser } from "../services/userService";
import onboardImage from "../assets/images/Onboard.png";
import onboardbackground from "../assets/images/Onboardbackground.png";
import logo from "../assets/images/logo.png";
import phoneicon from "../assets/images/iphone16.png";
import InstallButton from "../Components/InstallButton";

const SignIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUserType = searchParams.get("type");
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, [searchParams]);

  const handleSendCode = async () => {
    if (!phoneOrEmail.trim()) return setError("This field is required.");
    if (!userType) return setError("User type is missing!");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    let payload = { user_type: userType };

    if (emailRegex.test(phoneOrEmail)) payload.email = phoneOrEmail;
    else if (phoneRegex.test(phoneOrEmail)) payload.phone = phoneOrEmail;
    else return setError("Please enter a valid email or phone number");

    // console.log("Sending payload:", payload);

    try {
      setLoading(true);
      const res = await insertUser(payload, userType);
      if (res.success) {
        toast.success("OTP sent successfully!");
        navigate(`/otp?phoneOrEmail=${phoneOrEmail}&userType=${userType}`, { state: { userType, phoneOrEmail, authType: "register" } });
      } else {
        toast.error(res.message || "Something went wrong!");
      }
    } catch (err) {
      // console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full p-4 md:p-5 bg-gray-100 overflow-hidden">
      <div className="hidden min-[1025px]:flex flex-[1110] h-full items-center justify-center rounded-[20px] xl:rounded-[30px] overflow-hidden">
        <img
          src={onboardImage}
          alt="Onboarding illustration"
          className="w-full h-full object-cover"
        />
      </div>

      <div
        className="flex-[750] flex items-center justify-center rounded-[15px] xl:rounded-[20px] 2xl:rounded-[30px] lg:ml-3 xl:ml-5 bg-cover bg-center relative min-h-screen lg:min-h-full"
        style={{ backgroundImage: `url(${onboardbackground})` }}
      >
        <div className="absolute inset-0 bg-white/80 rounded-[15px] xl:rounded-[20px] 2xl:rounded-[30px]" />

        <div className="w-full max-w-[90%] max-[768px]:w-full max-[1025px]:w-[60%] max-[1440px]:w-[100%] min-[1441px]:w-[72%] relative z-10 flex flex-col justify-between p-1 xs:p-5 sm:p-6 md:p-7 lg:p-5 xl:p-6 2xl:p-8 rounded-xl min-h-[90vh] lg:min-h-[85vh]">

          <div className="flex items-center justify-center py-4">
            <img
              src={logo}
              alt="Logo"
              className="w-[140px] sm:w-[180px] md:w-[200px] lg:w-[180px] xl:w-[220px] 2xl:w-[240px] h-auto"
            />
          </div>

          <div className="flex-1 flex flex-col justify-center py-4 xs:py-5 sm:py-6 md:py-8 lg:py-4 xl:py-6">
            <h2 className="font-semibold text-[20px] xs:text-[24px] sm:text-[28px] md:text-[32px] lg:text-[26px] xl:text-[28px] 2xl:text-[32px] 3xl:text-[36px] leading-[1.3] xs:leading-[1.4] sm:leading-[1.5] text-center text-[#1A202C] mb-2 xs:mb-3 sm:mb-4">
              Sign Up<br /> with your phone/email
            </h2>

            <p className="font-medium text-[14px] sm:text-[15px] md:text-[16px] lg:text-[15px] xl:text-[16px] leading-[1.4] sm:leading-[1.5] md:leading-[24px] text-center text-[#718096] mb-4 sm:mb-5 md:mb-6 px-2">
              Use phone number or email for registered to continue.
            </p>

            <div className="mb-3 sm:mb-4">
              <label
                htmlFor="phoneOrEmail"
                className="block font-medium text-[14px] sm:text-[15px] md:text-[16px] text-[#1A202C] mb-2"
              >
                Phone or Email
              </label>

              <input
                type="text"
                id="phoneOrEmail"
                placeholder="Enter phone or email"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                className={`w-full h-[44px] sm:h-[48px] md:h-[50px] border rounded-[10px] px-3 py-2 text-[14px] sm:text-[15px] md:text-[16px] focus:ring-2 focus:outline-none placeholder:text-gray-400 ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#1A202C]"
                  }`}
              />
              {error && <p className="text-red-500 text-[12px] mt-1">{error}</p>}
            </div>

            <button
              onClick={handleSendCode}
              disabled={loading}
              className={`w-full h-[44px] sm:h-[48px] md:h-[50px] ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#152A45] hover:bg-gray-900"
                } text-white rounded-[10px] py-2 text-[14px] sm:text-[15px] md:text-[16px] font-medium mb-3 sm:mb-4 transition-colors duration-200 cursor-pointer`}
            >
              {loading ? "Sending..." : "Send Code"}
            </button>

            <div className="flex items-center mb-3 sm:mb-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="px-3 text-[11px] sm:text-[12px] text-gray-500">Or</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <button className="w-full h-[44px] sm:h-[48px] md:h-[50px] flex items-center justify-center border border-gray-300 rounded-[10px] py-2 text-[14px] sm:text-[15px] md:text-[16px] font-medium hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
              />
              Sign In With Google
            </button>
          </div>

          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
              <img src={phoneicon} alt="Hirra Logo" className="w-4 h-4 sm:w-5 sm:h-5 hidden sm:block" />
              <span>
                Install Hirra to your Home Screen for quick access.
                {/* <InstallButton /> */}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
