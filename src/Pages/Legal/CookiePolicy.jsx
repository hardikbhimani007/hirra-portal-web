import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

function CookiePolicy() {
    return (
        <>
            <Navbar />
            <div className="container mx-auto mt-18 sm:mt-24 px-4 sm:px-6 lg:px-8 py-6 sm:py-16">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-orange-500 mb-6 sm:mb-8 text-start">
                    Cookie Policy
                </h1>

                <div className="space-y-4 sm:space-y-6 text-gray-700 text-sm sm:text-base">
                    <p>
                        At Hirra, we use cookies to enhance your browsing experience and improve our services. This Cookie Policy explains what cookies are, how we use them, and your choices regarding their use.
                    </p>

                    <section>
                        <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4">1. What Are Cookies?</h2>
                        <p>
                            Cookies are small text files stored on your device by your browser. They help websites remember your preferences, login details, and provide a more personalized browsing experience.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4">2. How We Use Cookies</h2>
                        <ul className="list-disc list-inside space-y-1 sm:space-y-2">
                            <li>To remember your preferences and settings.</li>
                            <li>To improve website functionality and performance.</li>
                            <li>To analyze website traffic and usage.</li>
                            <li>To deliver personalized content and advertisements.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4">3. Types of Cookies We Use</h2>
                        <p className="mb-2">
                            We use the following types of cookies:
                        </p>
                        <ul className="list-disc list-inside space-y-1 sm:space-y-2">
                            <li><strong>Essential Cookies:</strong> Required for basic website functionality.</li>
                            <li><strong>Performance Cookies:</strong> Help us understand how visitors use the site.</li>
                            <li><strong>Functional Cookies:</strong> Store preferences for improved user experience.</li>
                            <li><strong>Advertising Cookies:</strong> Used to deliver relevant ads.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4">4. Managing Cookies</h2>
                        <p>
                            You can control or disable cookies through your browser settings. Please note that disabling cookies may affect website functionality.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4">5. Changes to This Cookie Policy</h2>
                        <p>
                            We may update this Cookie Policy occasionally. Any changes will be posted on this page with an updated date.
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

export default CookiePolicy;
