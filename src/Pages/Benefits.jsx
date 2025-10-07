import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { RiFlashlightFill, RiMapPinLine, RiUserHeartLine, RiTimeLine, RiShieldCheckLine, RiMoneyDollarCircleLine, RiTeamLine, RiTrophyLine } from "react-icons/ri";
import BgSvg1 from '../Components/Background/bg1';

function Benefits() {
    const keyBenefits = [
        {
            icon: RiMapPinLine,
            title: "Local Job Matching",
            description: "Find nearby work or workers using smart location and radius filters.",
            gradient: "from-[#FF5800]/16"
        },
        {
            icon: RiUserHeartLine,
            title: "Easy Profiles & Messaging",
            description: "Build a simple profile, connect instantly, and chat directly within the platform.",
            gradient: "from-[#FF5800]/16"
        },
        {
            icon: RiTimeLine,
            title: "Fast Job Posting & Review",
            description: "Post jobs in minutes, review applicants quickly, and hire without delays.",
            gradient: "from-[#FF5800]/16"
        }
    ];

    const additionalBenefits = [
        {
            icon: RiShieldCheckLine,
            title: "Verified Profiles",
            description: "All users go through verification process to ensure authenticity and trustworthiness.",
            gradient: "from-blue-500/16"
        },
        {
            icon: RiMoneyDollarCircleLine,
            title: "Transparent Pricing",
            description: "No hidden fees. Clear pricing structure with competitive rates for all services.",
            gradient: "from-green-500/16"
        },
        {
            icon: RiTeamLine,
            title: "Team Collaboration",
            description: "Manage multiple team members and collaborate on projects seamlessly.",
            gradient: "from-purple-500/16"
        }
    ];

    const whyChooseUs = [
        {
            icon: RiTrophyLine,
            title: "Proven Track Record",
            description: "Over 10,000+ successful job matches with 98% satisfaction rate.",
            stats: "10,000+",
            statsLabel: "Successful Matches"
        },
        {
            icon: RiFlashlightFill,
            title: "Lightning Fast",
            description: "Average job posting to hire time reduced by 75% compared to traditional methods.",
            stats: "75%",
            statsLabel: "Faster Hiring"
        },
        {
            icon: RiShieldCheckLine,
            title: "100% Secure",
            description: "Bank-level security with end-to-end encryption for all communications.",
            stats: "100%",
            statsLabel: "Secure Platform"
        }
    ];

    return (
        <>
            <Navbar />
            
            {/* Hero Section */}
            {/* <section className="relative w-full mt-24 pt-12 md:pt-20 flex justify-center overflow-hidden bg-gradient-to-br from-[#FEF9F6] to-white">
                <BgSvg1 />
                <div className="container mx-auto  flex flex-col items-center px-4 text-center relative z-10">
                    <h1 
                        className="text-3xl md:text-6xl font-bold mb-6"
                        style={{ color: "var(--color-theme1)" }}
                    >
                        Platform Benefits
                    </h1>
                    <p 
                        className="text-lg md:text-xl mb-8 max-w-3xl"
                        style={{ color: "var(--color-theme3)" }}
                    >
                        Discover how our platform revolutionizes the way people find work and hire talent. 
                        Experience seamless connections, faster hiring, and better outcomes for everyone.
                    </p>
                </div>
            </section> */}

            {/* Key Benefits Section */}
            <section className="relative w-full py-12 mt-24 md:py-20 flex justify-center overflow-hidden bg-[#FEF9F6]">
                <BgSvg1 />
                <div className="container mx-auto flex flex-col items-center px-4 gap-6 text-center relative z-10">
                    <h2
                        className="text-2xl md:text-4xl font-bold mb-4"
                        style={{ color: "var(--color-theme1)" }}
                    >
                        Core Features
                    </h2>
                    <p 
                        className="text-base md:text-lg mb-8 max-w-2xl"
                        style={{ color: "var(--color-theme3)" }}
                    >
                        Our platform is built with three fundamental pillars that make job searching and hiring effortless.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full">
                        {keyBenefits.map((benefit, index) => {
                            const IconComponent = benefit.icon;
                            return (
                                <div key={index} className="relative p-6 md:p-10 py-8 md:py-12 flex flex-col items-center rounded-[20px] bg-gradient-to-bl from-[#FF5800]/16 via-white to-white overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1">
                                    <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-[#FF5800]/20 to-transparent rounded-full blur-xl"></div>
                                    
                                    <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-[#FF5800] to-[#FF7A33] shadow-lg z-10">
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </div>
                                    
                                    <h3
                                        className="font-bold text-base lg:text-xl mb-4 text-center z-10"
                                        style={{ color: "var(--color-theme1)" }}
                                    >
                                        {benefit.title}
                                    </h3>
                                    <p
                                        className="text-sm lg:text-base text-center z-10 leading-relaxed"
                                        style={{ color: "var(--color-theme3)" }}
                                    >
                                        {benefit.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Additional Benefits Section */}
            <section className="relative w-full py-12 md:py-20 flex justify-center overflow-hidden bg-white">
                <div className="container mx-auto flex flex-col items-center px-4 gap-6 text-center relative z-10">
                    <h2
                        className="text-2xl md:text-4xl font-bold mb-4"
                        style={{ color: "var(--color-theme1)" }}
                    >
                        Additional Advantages
                    </h2>
                    <p 
                        className="text-base md:text-lg mb-8 max-w-2xl"
                        style={{ color: "var(--color-theme3)" }}
                    >
                        Beyond our core features, we provide extra value that sets us apart from the competition.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full">
                        {additionalBenefits.map((benefit, index) => {
                            const IconComponent = benefit.icon;
                            const gradientColors = {
                                'from-blue-500/16': { bg: 'from-blue-500 to-blue-600', icon: 'text-blue-600' },
                                'from-green-500/16': { bg: 'from-green-500 to-green-600', icon: 'text-green-600' },
                                'from-purple-500/16': { bg: 'from-purple-500 to-purple-600', icon: 'text-purple-600' }
                            };
                            const colors = gradientColors[benefit.gradient];
                            
                            return (
                                <div key={index} className={`relative p-6 md:p-10 py-8 md:py-12 flex flex-col items-center rounded-[20px] bg-gradient-to-bl ${benefit.gradient} via-white to-white overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1`}>
                                    <div className={`absolute top-4 right-4 w-16 h-16 bg-gradient-to-br ${benefit.gradient.replace('/16', '/20')} to-transparent rounded-full blur-xl`}></div>
                                    
                                    <div className={`mb-6 p-4 rounded-full bg-gradient-to-br ${colors.bg} shadow-lg z-10`}>
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </div>
                                    
                                    <h3
                                        className="font-bold text-base lg:text-xl mb-4 text-center z-10"
                                        style={{ color: "var(--color-theme1)" }}
                                    >
                                        {benefit.title}
                                    </h3>
                                    <p
                                        className="text-sm lg:text-base text-center z-10 leading-relaxed"
                                        style={{ color: "var(--color-theme3)" }}
                                    >
                                        {benefit.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="relative w-full py-12 md:py-20 flex justify-center overflow-hidden bg-gradient-to-br from-[#FEF9F6] to-white">
                <BgSvg1 />
                <div className="container mx-auto flex flex-col items-center px-4 gap-6 text-center relative z-10">
                    <h2
                        className="text-2xl md:text-4xl font-bold mb-4"
                        style={{ color: "var(--color-theme1)" }}
                    >
                        Why Choose Our Platform?
                    </h2>
                    <p 
                        className="text-base md:text-lg mb-8 max-w-2xl"
                        style={{ color: "var(--color-theme3)" }}
                    >
                        Numbers don't lie. See why thousands of users trust our platform for their hiring needs.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full">
                        {whyChooseUs.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <div key={index} className="relative p-8 md:p-10 flex flex-col items-center rounded-[24px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                                    <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-[#FF5800] to-[#FF7A33] shadow-xl">
                                        <IconComponent className="w-10 h-10 text-white" />
                                    </div>
                                    
                                    <div 
                                        className="text-3xl md:text-4xl font-bold mb-2"
                                        style={{ color: "var(--color-theme1)" }}
                                    >
                                        {item.stats}
                                    </div>
                                    
                                    <div 
                                        className="text-sm md:text-base font-medium mb-4 text-orange-600"
                                    >
                                        {item.statsLabel}
                                    </div>
                                    
                                    <h3
                                        className="font-bold text-lg md:text-xl mb-4 text-center"
                                        style={{ color: "var(--color-theme1)" }}
                                    >
                                        {item.title}
                                    </h3>
                                    <p
                                        className="text-sm md:text-base text-center leading-relaxed"
                                        style={{ color: "var(--color-theme3)" }}
                                    >
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="relative w-full py-16 md:py-24 flex justify-center overflow-hidden bg-gradient-to-r from-[#FF5800] to-[#FF7A33]">
                <div className="container mx-auto flex flex-col items-center px-4 text-center relative z-10">
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
                        Ready to Experience These Benefits?
                    </h2>
                    <p className="text-base md:text-lg text-white/90 mb-8 max-w-2xl">
                        Join thousands of satisfied users who have transformed their hiring process. 
                        Start your journey today and see the difference for yourself.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="px-8 py-4 bg-white text-[#FF5800] font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            Get Started Free
                        </button>
                        <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#FF5800] transition-all duration-300">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            <Footer/>
        </>
    )
}

export default Benefits