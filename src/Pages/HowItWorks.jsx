import Navbar from '../Components/Navbar'

function HowItWorksPage() {
    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <h1 className="text-4xl md:text-6xl font-bold text-orange-500 mb-4">
                    Coming Soon!
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-8">
                    This page is still in progress. Stay tuned!
                </p>
                {/* <img
                        src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png"
                        alt="Under Construction"
                        className="w-64 md:w-96"
                    /> */}
            </div>
        </>
    )
}

export default HowItWorksPage
