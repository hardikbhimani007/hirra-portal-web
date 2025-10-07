import { IoMailOutline, IoCallOutline } from "react-icons/io5";
import Logo from "../assets/Mask group.svg";

import call from "../assets/Landing/call.svg";
import sms from "../assets/Landing/sms.svg";
import bg3 from "../assets/Landing/bg3.svg";

import EarlyAccessCard from "../Components/Landing/EarlyAccessCard";

export default function Footer() {
  return (
    <div>
      {/* <div className="mt-36"> */}
      {/* <EarlyAccessCard /> */}
      {/* </div> */}

      <footer className="bg-[#152A45] text-white px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-8 py-8 md:py-14 border-b border-gray-600">

          <div className="col-span-1 md:col-span-1 my-4 md:my-0">
            <div className="flex items-center">
              <img src={Logo} alt="Logo" className="w-40 h-20 cursor-pointer" />
            </div>
            <p className="text-[#B8BFC7] font-semibold text-sm md:text-lg leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s.
            </p>
          </div> 

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8 col-span-1 md:col-span-3">
            <div className="flex justify-start md:justify-center">
              <div>
                <h3 className="font-semibold text-[#B8BFC7] text-base md:text-lg mb-2">Quick Links</h3>
                <ul className="space-y-2 text-sm md:text-base">
                  <li><a href="/" className="text-white transition duration-400 hover:text-[#B8BFC7]">Home</a></li>
                  <li><a href="/" className="text-white transition duration-400 hover:text-[#B8BFC7]">How It Works?</a></li>
                  <li><a href="/trustcompliance" className="text-white transition duration-400 hover:text-[#B8BFC7]">Trust & Compliance</a></li>
                  <li><a href="/benefits" className="text-white transition duration-400 hover:text-[#B8BFC7]">Benefits</a></li>
                  <li><a href="/contactus" className="text-white transition duration-400 hover:text-[#B8BFC7]">Contact Us</a></li>
                </ul>
              </div>
            </div>

            <div className="flex justify-start md:justify-center">
              <div>
                <h3 className="font-semibold text-[#B8BFC7] text-base md:text-lg mb-2">Legal</h3>
                <ul className="space-y-2 text-sm md:text-base">
                  <li><a href="/legal/termsofservice" className="text-white transition duration-400 hover:text-[#B8BFC7]">Terms of Service</a></li>
                  <li><a href="/legal/privacypolicy" className="text-white transition duration-400 hover:text-[#B8BFC7]">Privacy Policy</a></li>
                  <li><a href="/legal/cookiepolicy" className="text-white transition duration-400 hover:text-[#B8BFC7]">Cookie Policy</a></li>
                </ul>
              </div>
            </div>

            <div className="flex justify-start md:justify-end">
              <div>
                <h3 className="font-semibold text-[#B8BFC7] text-base md:text-lg mb-2">Support</h3>
                <ul className="space-y-3 text-sm md:text-base">
                  <li className="flex items-center gap-2 group cursor-pointer">
                    <img
                      src={sms}
                      alt="Email"
                      className="w-4 h-4 md:w-5 md:h-5 transition duration-400 group-hover:scale-110 group-hover:opacity-80"
                    />
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=Support@Hirra.Com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white transition duration-400 group-hover:text-[#B8BFC7]"
                    >
                      Support@Hirra.Com
                    </a>
                  </li>
                  <li className="flex items-center gap-2 group cursor-pointer">
                    <img
                      src={call}
                      alt="Phone"
                      className="w-4 h-4 md:w-5 md:h-5 transition duration-400 group-hover:scale-110 group-hover:opacity-80"
                    />
                    <a
                      href="tel:+44123456789"
                      className="text-white transition duration-400 group-hover:text-[#B8BFC7]"
                    >
                      +44 123 456 789
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="py-4 md:py-6 text-center text-white text-sm md:text-lg">
          © 2025 Hirra Ltd. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
