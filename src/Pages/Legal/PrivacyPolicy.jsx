import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

function PrivacyPolicy() {
    return (
        <>
            <Navbar />
            <div className="container mx-auto mt-18 sm:mt-24 px-4 sm:px-6 lg:px-8 py-6 sm:py-16">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-orange-500 mb-6 sm:mb-8 text-start">
                    Privacy Policy
                </h1>

                <div className="space-y-4 sm:space-y-6 text-gray-700 text-sm sm:text-base">
                    <p>
                        At Hirra, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.
                    </p>

                    <section>
                        <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4">1. Information We Collect</h2>
                        <p className="mb-2">
                            We collect information that you provide directly to us when using our platform, such as your name, email address, contact details, and any information you upload to your profile.
                        </p>
                        <p>
                            We may also collect information automatically through cookies and analytics tools to improve our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4">2. How We Use Your Information</h2>
                        <ul className="list-disc list-inside space-y-1 sm:space-y-2">
                            <li>To provide and improve our services.</li>
                            <li>To verify your identity and qualifications.</li>
                            <li>To communicate with you about updates or offers.</li>
                            <li>To comply with legal obligations.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4">3. Data Sharing and Security</h2>
                        <p className="mb-2">
                            We do not sell your personal information to third parties. Your information may be shared with verified tradespeople and subcontractors to facilitate job connections.
                        </p>
                        <p>
                            We implement strict security measures to safeguard your data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4">4. Your Rights</h2>
                        <p>
                            You have the right to access, correct, or delete your personal information. You can contact us anytime for assistance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4">5. Changes to This Privacy Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                        </p>
                    </section>

                    <p className="text-start text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8">
                        © 2025 Hirra. All Rights Reserved.
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default PrivacyPolicy;
