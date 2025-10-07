import { useState } from "react";
import access from "../../assets/Landing/access.webp";
import bg3 from "../../assets/Landing/bg3.svg";

export default function EarlyAccessCard() {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(emailRegex.test(value));
  };

  const handleSubmit = () => {
    if (!isValid) return; 
    alert(`Email submitted: ${email}`); 
  };

  return (
    <div className="relative max-[1440px]:my-16 min-[1441px]:mt-46">
      <img src={bg3} alt="Background" className="w-full hidden 2xl:block" />

      <div className="w-full max-w-6xl px-2 sm:px-4 md:px-6 mx-auto
                      relative 2xl:absolute 2xl:bottom-30 2xl:left-1/2 2xl:-translate-x-1/2">
        <div className="bg-[#F6F6F7] rounded-2xl px-4 sm:px-6 md:px-14 py-6 sm:py-8 flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl sm:text-2xl md:text-5xl font-semibold text-[#1A202C]">
              Get Early Access
            </h2>
            <p className="text-[#718096] mt-2 sm:mt-3">
              Leave Your Email And Be The First To Know When We Launch.
            </p>

            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleChange}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <button
                onClick={handleSubmit}
                disabled={!isValid}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition cursor-pointer
                  ${isValid ? "bg-[#152A45] text-white hover:bg-[#0e1c32]" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                Notify Me
              </button>
            </div>

            <p className="text-sm text-[#718096] mt-1 sm:mt-2 italic">
              No Spam, Only Important Updates
            </p>
          </div>

          <div className="flex-1 flex justify-center mt-4 md:mt-0">
            <img
              src={access}
              alt="Early Access Illustration"
              className="w-72 md:w-96 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
