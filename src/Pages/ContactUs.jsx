import { useState } from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import {
    RiMailLine,
    RiPhoneLine,
    RiMapPinLine,
    RiTimeLine,
    RiSendPlaneLine,
    RiCustomerService2Line,
    RiQuestionLine,
    RiBriefcaseLine,
    RiUserLine,
    RiMessage2Line
} from "react-icons/ri";
import BgSvg1 from '../Components/Background/bg1';
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            alert('Thank you for your message! We\'ll get back to you soon.');
            setFormData({
                name: '',
                email: '',
                subject: '',
                category: '',
                message: ''
            });
            setIsSubmitting(false);
        }, 2000);
    };

    const contactMethods = [
        {
            icon: RiMailLine,
            title: "Email Us",
            primary: "support@jobplatform.com",
            secondary: "hello@jobplatform.com",
            description: "Send us an email anytime"
        },
        {
            icon: RiPhoneLine,
            title: "Call Us",
            primary: "+1 (555) 123-4567",
            secondary: "+1 (555) 987-6543",
            description: "Mon-Fri 9AM-6PM EST"
        },
        {
            icon: RiMapPinLine,
            title: "Visit Us",
            primary: "123 Business Street",
            secondary: "New York, NY 10001",
            description: "Our headquarters"
        },
        {
            icon: RiTimeLine,
            title: "Business Hours",
            primary: "Monday - Friday",
            secondary: "9:00 AM - 6:00 PM EST",
            description: "We're here to help"
        }
    ];

    const supportCategories = [
        {
            icon: RiCustomerService2Line,
            title: "General Support",
            description: "Get help with account issues, technical problems, or platform navigation."
        },
        {
            icon: RiBriefcaseLine,
            title: "Business Inquiries",
            description: "Enterprise solutions, partnerships, and bulk hiring requirements."
        },
        {
            icon: RiQuestionLine,
            title: "FAQ & Help",
            description: "Find answers to commonly asked questions and platform guides."
        }
    ];

    return (
        <>
            <Navbar />

            {/* Contact Form Section */}
            <section className="relative w-full mt-24 py-12 md:py-20 flex justify-center overflow-hidden bg-[#FEF9F6]">
                <BgSvg1 />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <h2
                            className="text-2xl md:text-4xl font-bold mb-4 text-center"
                            style={{ color: "var(--color-theme1)" }}
                        >
                            Send Us a Message
                        </h2>
                        <p
                            className="text-base md:text-lg mb-8 text-center max-w-2xl mx-auto"
                            style={{ color: "var(--color-theme3)" }}
                        >
                            Fill out the form below and we'll get back to you as soon as possible.
                        </p>

                        <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-6 md:p-10">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-semibold mb-2"
                                            style={{ color: "var(--color-theme1)" }}
                                        >
                                            Full Name *
                                        </label>
                                        <div className="relative">
                                            <RiUserLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5800]/20 focus:border-[#FF5800] transition-all duration-300"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-semibold mb-2"
                                            style={{ color: "var(--color-theme1)" }}
                                        >
                                            Email Address *
                                        </label>
                                        <div className="relative">
                                            <RiMailLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5800]/20 focus:border-[#FF5800] transition-all duration-300"
                                                placeholder="Enter your email address"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="category"
                                            className="block text-sm font-semibold mb-2"
                                            style={{ color: "var(--color-theme1)" }}
                                        >
                                            Category *
                                        </label>
                                        <FormControl fullWidth variant="outlined">
                                            <Select
                                                id="category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                required
                                                displayEmpty
                                                MenuProps={{ disableScrollLock: true }}
                                                sx={{
                                                    borderRadius: "12px",
                                                    height: "50px",
                                                    "& .MuiSelect-select": {
                                                        paddingY: "10px",
                                                        paddingX: "10px",
                                                    },
                                                    "& fieldset": {
                                                        borderColor: "#e5e7eb",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "#FF5800",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "#FF5800",
                                                        boxShadow: "none",
                                                    },
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        boxShadow: "none",
                                                    },
                                                }}
                                            >
                                                <MenuItem value="">
                                                    <span className="text-gray-400">Select a category</span>
                                                </MenuItem>
                                                <MenuItem value="general">General Support</MenuItem>
                                                <MenuItem value="technical">Technical Issues</MenuItem>
                                                <MenuItem value="business">Business Inquiries</MenuItem>
                                                <MenuItem value="partnership">Partnership</MenuItem>
                                                <MenuItem value="feedback">Feedback</MenuItem>
                                                <MenuItem value="other">Other</MenuItem>
                                            </Select>
                                        </FormControl>

                                    </div>

                                    <div>
                                        <label
                                            htmlFor="subject"
                                            className="block text-sm font-semibold mb-2"
                                            style={{ color: "var(--color-theme1)" }}
                                        >
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5800]/20 focus:border-[#FF5800] transition-all duration-300"
                                            placeholder="Brief subject of your message"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-semibold mb-2"
                                        style={{ color: "var(--color-theme1)" }}
                                    >
                                        Message *
                                    </label>
                                    <div className="relative">
                                        <RiMessage2Line className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={5}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5800]/20 focus:border-[#FF5800] transition-all duration-300 resize-none"
                                            placeholder="Please provide details about your inquiry..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-4 bg-gradient-to-r from-[#FF5800] to-[#FF7A33] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <RiSendPlaneLine className="w-5 h-5" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default ContactUs