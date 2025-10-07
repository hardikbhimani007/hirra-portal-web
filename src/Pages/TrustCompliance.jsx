import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'

function TrustCompliance() {
    return (
        <>
            <Navbar />
            <section className="flex flex-col items-center justify-center text-center px-6 py-26 min-h-[70vh] bg-gradient-to-b from-gray-50 to-white">
                {/* Illustration */}
                <img
                    src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png"
                    alt="Trust & Compliance"
                    className="w-40 h-40 md:w-56 md:h-56 mb-6"
                />

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-extrabold text-orange-500 mb-4">
                    Trust & Compliance
                </h1>

                {/* Subtitle */}
                <p className="text-base md:text-lg text-gray-600 max-w-2xl mb-12">
                    At Herra, we are committed to ensuring security, transparency,
                    and compliance across all our services. Below are some of the areas
                    we are actively working on.
                </p>

                {/* Dummy Data Section */}
                <div className="grid gap-6 md:grid-cols-3 max-w-5xl w-full">
                    <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Data Protection
                        </h3>
                        <p className="text-gray-600 text-sm">
                            We prioritize safeguarding customer data with advanced encryption,
                            secure storage, and regular audits.
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Compliance Standards
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Our systems are being aligned with GDPR, ISO 27001, and other
                            global compliance frameworks.
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Transparency
                        </h3>
                        <p className="text-gray-600 text-sm">
                            We believe in openness and provide detailed reports on how we
                            manage and protect your information.
                        </p>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default TrustCompliance
