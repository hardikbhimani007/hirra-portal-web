import { useState } from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import LandingIntro from '../Components/Landing/LandingIntro'
import HowItWorks from '../Components/Landing/HowItWorks'
import Secure from '../Components/Landing/Secure'
import KeyBenefits from '../Components/Landing/KeyBenefits'

function Landing() {
    return (
        <>
            <Navbar />
            <LandingIntro />
            <HowItWorks />
            <Secure />
            <KeyBenefits />
            <Footer />
        </>
    )
}

export default Landing
