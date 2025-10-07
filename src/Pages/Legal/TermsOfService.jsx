import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

function TermsOfService() {
    return (
        <>
            <Navbar />
            <div className="container mx-auto mt-18 sm:mt-24 px-4 sm:px-6 lg:px-8 py-6 sm:py-16">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-orange-500 mb-6 sm:mb-8">
                    Terms of Service
                </h1>

                <div className="space-y-4 sm:space-y-6 text-gray-700 text-sm sm:text-base">
                    <p>
                        Welcome to Hirra! By using our services, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
                    </p>

                    <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using our platform, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use our services.
                    </p>

                    <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">2. User Responsibilities</h2>
                    <p>
                        You are responsible for maintaining the confidentiality of your account and ensuring all information provided is accurate and up-to-date.
                    </p>

                    <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">3. Service Use</h2>
                    <p>
                        Our platform connects subcontractors and tradespeople. You must use the platform only for lawful purposes and in compliance with applicable laws.
                    </p>

                    <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">4. Termination</h2>
                    <p>
                        We reserve the right to terminate or suspend access to the platform without notice for conduct that violates these terms.
                    </p>

                    <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">5. Changes to Terms</h2>
                    <p>
                        Hirra may update these terms from time to time. Changes will be posted here and will take effect immediately.
                    </p>

                    <p className="mt-6 sm:mt-8">
                        For more details or questions, please{" "}
                        <a href="/contactus" className="text-orange-500 font-semibold">
                            contact us
                        </a>.
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default TermsOfService;
