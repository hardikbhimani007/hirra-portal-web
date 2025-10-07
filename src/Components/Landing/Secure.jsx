import { useState } from 'react';

import s1 from '../../assets/Landing/s1.svg';
import Secure1 from '../../assets/Landing/Secure1.png';
import Secure2 from '../../assets/Landing/Secure2.png';

function Secure() {
    return (
        <section className="relative w-full flex items-center justify-center bg-[#152A45] overflow-hidden py-12 md:py-30">
            <div className="absolute left-0 top-0 h-full">
                <img
                    src={Secure2}
                    alt="bg-left"
                    className="h-full object-cover"
                    style={{
                        maskImage: 'linear-gradient(to right, black 80%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent 100%)',
                    }}
                />
            </div>
            <div className="absolute right-0 top-0 h-full">
                <img
                    src={Secure1}
                    alt="bg-right"
                    className="h-full object-cover"
                    style={{
                        maskImage: 'linear-gradient(to left, black 80%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to left, black 80%, transparent 100%)',
                    }}
                />
            </div>
            <div className="relative z-10 flex flex-col items-center text-center gap-5 px-4">
                <img src={s1} alt="secure" className="md:mb-6 w-20 h-20 md:w-26 md:h-26" />
                <p className="font-semibold text-white text-lg md:text-5xl">
                    All workers must have a valid CSCS card.
                </p>
                <p className="text-white text-sm md:text-2xl">
                    Verified workforce = safer worksites
                </p>
            </div>
        </section>
    );
}


export default Secure;
