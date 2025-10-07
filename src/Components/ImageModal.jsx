import React from "react";
import { IoMdClose } from "react-icons/io";

const ImageModal = ({ isOpen, onClose, imageSrc }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="relative w-full h-full max-w-[95vw] max-h-[95vh] flex items-center justify-center">
                <div className="relative">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-white text-2xl bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-80 transition cursor-pointer z-10"
                    >
                        <IoMdClose />
                    </button>

                    <img
                        src={imageSrc}
                        alt="Preview"
                        className="max-w-full max-h-[95vh] object-contain rounded-md"
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageModal;
