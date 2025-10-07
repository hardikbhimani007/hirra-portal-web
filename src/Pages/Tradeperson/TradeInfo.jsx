import React, { useState, useEffect, useRef } from "react";
import 'leaflet/dist/leaflet.css';
import onboardImage from "../../assets/images/Onboard.png";
import cscs from "../../assets/images/addimageicon.png";
import onboardImage1 from "../../assets/images/Onboard1.svg";
import onboardbackground from "../../assets/images/Onboardbackground.png";
import logo from "../../assets/images/logo.png";
import profileicon from "../../assets/images/profileicon.png";
import { HiOutlineMapPin } from "react-icons/hi2";
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CreateUsers } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { Stepper, Step, StepLabel, StepConnector, stepConnectorClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme, useMediaQuery } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const libraries = ["places"];

const TradeInfo = () => {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [cscsFile, setCscsFile] = useState(null);
    const [cscsFileName, setCscsFileName] = useState("");
    const [cscsBase64, setCscsBase64] = useState("");
    const [isDragOver, setIsDragOver] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [mapsError, setMapsError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery("(max-width:425px)");

    const MIN_RADIUS = 5;
    const MAX_RADIUS = 100;

    const [errors, setErrors] = useState({
        name: "",
        title: "",
        description: "",
        trades: "",
        skills: "",
        location: "",
        radius: "",
        hourlyRate: "",
        availability: "",
        image: "",
        cscs: ""
    });

    const [formData, setFormData] = useState({
        name: "",
        title: "",
        description: "",
        trades: [],
        skills: [],
        location: "",
        radius: 5,
        radiusUnit: "km",
        position: null,
        hourlyRate: "",
        availability: "",
    });

    const [tradeInput, setTradeInput] = useState("");
    const [skillInput, setSkillInput] = useState("");

    const mapRef = useRef();
    const autocompleteRef = useRef();
    const steps = [
        "Basic Information",
        "Trade & Skills",
        "Location & Travel Radius",
        "Rate & Availability"
    ];

    const [showCameraModal, setShowCameraModal] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);




    const handleTakePhoto = (e) => {
        e.stopPropagation();
        setShowCameraModal(true);
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setCameraStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
            toast.error("Unable to access camera. Please check permissions.");
            // Fallback to file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.capture = 'environment';
            fileInput.onchange = handleCameraFileSelect;
            fileInput.click();
        }
    };

    const handleCameraFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            processCapturedImage(file);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw current video frame to canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas to blob
            canvas.toBlob((blob) => {
                const file = new File([blob], `cscs-photo-${Date.now()}.jpg`, {
                    type: 'image/jpeg'
                });
                processCapturedImage(file);
            }, 'image/jpeg', 0.8);
        }
    };

    const processCapturedImage = (file) => {
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, cscs: "Image size must be less than 5MB" }));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setCscsFileName(`cscs-photo-${Date.now()}.jpg`);
            setCscsBase64(base64String);
            setErrors(prev => ({ ...prev, cscs: "" }));
            setShowCameraModal(false);

            // Stop camera stream
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
                setCameraStream(null);
            }

            toast.success("CSCS card photo captured successfully!");
        };
        reader.readAsDataURL(file);
    };

    const closeCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setShowCameraModal(false);
    };

    // Add this useEffect to start camera when modal opens
    useEffect(() => {
        if (showCameraModal) {
            startCamera();
        }
    }, [showCameraModal]);
    const DottedConnector = styled(StepConnector)(({ theme }) => ({
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 14,
        },
        [`& .${stepConnectorClasses.line}`]: {
            borderTopStyle: 'dotted',
            borderColor: '#E0E0E0',
            borderTopWidth: 2,
        },
        [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
            borderColor: '#000000',
        },
        [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
            borderColor: '#000000',
        },
    }));

    const BigStepIcon = styled('div')(({ ownerState }) => {
        let bgColor = '#fff';
        let borderColor = '#E0E0E0';
        let fontColor = '#E0E0E0';

        if (ownerState.completed) {
            bgColor = '#FF5800';
            borderColor = '#FF5800';
            fontColor = '#fff';
        } else if (ownerState.active) {
            bgColor = '#fff';
            borderColor = '#FF5800';
            fontColor = '#FF5800';
        }

        return {
            width: 34,
            height: 34,
            borderRadius: '50%',
            backgroundColor: bgColor,
            border: `2px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            color: fontColor,
            fontWeight: 'bold',
        };
    });

    // const steps = [
    //     { number: 1, title: "Basic Information" },
    //     { number: 2, title: "Trade & Skills" },
    //     { number: 3, title: "Location & Travel Radius" },
    //     { number: 4, title: "Rate & Availability" },
    // ];

    const width = window.innerWidth;
    let percentage;
    if (width < 1024) {
        percentage = 82;
    } else if (width >= 1024 && width <= 1440) {
        percentage = 72;
    } else {
        percentage = 80;
    }

    const validateStep1 = () => {
        const newErrors = {
            name: "",
            title: "",
            description: "",
            image: "",
            cscs: ""
        };

        let isValid = true;

        // Name validation (2-50 characters)
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters long";
            isValid = false;
        } else if (formData.name.trim().length > 50) {
            newErrors.name = "Name cannot exceed 50 characters";
            isValid = false;
        } else if (!/^[a-zA-Z\s\-'.]+$/.test(formData.name.trim())) {
            newErrors.name = "Name can only contain letters, spaces, hyphens, apostrophes, and periods";
            isValid = false;
        }

        // Title validation (2-100 characters)
        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
            isValid = false;
        } else if (formData.title.trim().length < 2) {
            newErrors.title = "Title must be at least 2 characters long";
            isValid = false;
        } else if (formData.title.trim().length > 100) {
            newErrors.title = "Title cannot exceed 100 characters";
            isValid = false;
        }

        // Description validation (10-500 characters)
        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
            isValid = false;
        } else if (formData.description.trim().length < 10) {
            newErrors.description = "Description must be at least 10 characters long";
            isValid = false;
        } else if (formData.description.trim().length > 500) {
            newErrors.description = "Description cannot exceed 500 characters";
            isValid = false;
        }

        if (!selectedImage && !previewUrl) {
            newErrors.image = "Profile image is required";
            isValid = false;
        }

        setErrors(prev => ({ ...prev, ...newErrors }));
        return isValid;
    };

    const validateStep2 = () => {
        const newErrors = {
            trades: "",
            skills: ""
        };

        let isValid = true;

        if (formData.trades.length === 0) {
            newErrors.trades = "At least one trade is required";
            isValid = false;
        } else if (formData.trades.length > 5) {
            newErrors.trades = "Maximum 5 trades allowed";
            isValid = false;
        }

        if (formData.skills.length === 0) {
            newErrors.skills = "At least one skill is required";
            isValid = false;
        } else if (formData.skills.length > 15) {
            newErrors.skills = "Maximum 15 skills allowed";
            isValid = false;
        }

        setErrors(prev => ({ ...prev, ...newErrors }));
        return isValid;
    };

    const validateStep3 = () => {
        const newErrors = {
            location: "",
            radius: ""
        };

        let isValid = true;

        if (!formData.location.trim()) {
            newErrors.location = "Location is required";
            isValid = false;
        }

        if (!formData.radius || formData.radius < 1) {
            newErrors.radius = "Radius must be at least 1";
            isValid = false;
        }

        setErrors(prev => ({ ...prev, ...newErrors }));
        return isValid;
    };

    const validateStep4 = () => {
        const newErrors = {
            hourlyRate: "",
            availability: ""
        };

        let isValid = true;

        if (!formData.hourlyRate) {
            newErrors.hourlyRate = "Hourly rate is required";
            isValid = false;
        } else if (parseFloat(formData.hourlyRate) < 5) {
            newErrors.hourlyRate = "Minimum hourly rate must be at least $5";
            isValid = false;
        }

        if (!formData.availability) {
            newErrors.availability = "Please select your availability";
            isValid = false;
        }

        setErrors(prev => ({ ...prev, ...newErrors }));
        return isValid;
    };

    const validateAllSteps = () => {
        const step1Valid = validateStep1();
        const step2Valid = validateStep2();
        const step3Valid = validateStep3();
        const step4Valid = validateStep4();

        return step1Valid && step2Valid && step3Valid && step4Valid;
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleNameChange = (value) => {
        // Limit to 50 characters
        if (value.length <= 50) {
            handleInputChange("name", value);
        }
    };

    const handleTitleChange = (value) => {
        // Limit to 100 characters
        if (value.length <= 100) {
            handleInputChange("title", value);
        }
    };

    const handleDescriptionChange = (value) => {
        // Limit to 500 characters
        if (value.length <= 500) {
            handleInputChange("description", value);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, image: "Image size must be less than 5MB" }));
                return;
            }

            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, image: "Please select a valid image file" }));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);

            setErrors(prev => ({ ...prev, image: "" }));
        }
    };


    const handleRemoveImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        setErrors(prev => ({ ...prev, image: "Profile image is required" }));
    };

    const handleCscsFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedExtensions = [".cscs", ".pdf"];
        const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            setErrors({ cscs: "Please select a CSCS or PDF file" });
            return;
        }

        setErrors((prev) => ({ ...prev, cscs: "" }));

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setCscsFileName(file.name);
            setCscsBase64(base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleCscsDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleCscsDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleCscsDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.name.endsWith('.cscs')) {
                setCscsFile(file);
                setCscsFileName(file.name);
                setErrors(prev => ({ ...prev, cscs: "" }));
            } else {
                setErrors(prev => ({ ...prev, cscs: "Please select a CSCS file" }));
            }
        }
    };

    const handleBrowseClick = () => {
        document.getElementById('cscs-file-upload').click();
    };

    // const handleTakePhoto = (e) => {
    //     e.stopPropagation();

    //     // Create a file input element for camera capture
    //     const fileInput = document.createElement('input');
    //     fileInput.type = 'file';
    //     fileInput.accept = 'image/*';

    //     // Add capture attribute for mobile devices to use camera
    //     fileInput.setAttribute('capture', 'environment');

    //     fileInput.onchange = (event) => {
    //         const file = event.target.files[0];
    //         if (file) {
    //             if (file.size > 5 * 1024 * 1024) {
    //                 setErrors(prev => ({ ...prev, cscs: "Image size must be less than 5MB" }));
    //                 return;
    //             }

    //             if (!file.type.startsWith('image/')) {
    //                 setErrors(prev => ({ ...prev, cscs: "Please select a valid image file" }));
    //                 return;
    //             }

    //             const reader = new FileReader();
    //             reader.onloadend = () => {
    //                 const base64String = reader.result;
    //                 setCscsFileName(`camera-capture-${Date.now()}.jpg`);
    //                 setCscsBase64(base64String);
    //                 setErrors(prev => ({ ...prev, cscs: "" }));

    //                 // Show success message
    //                 toast.success("Photo captured successfully!");
    //             };
    //             reader.readAsDataURL(file);
    //         }
    //     };

    //     // Trigger the file input click
    //     fileInput.click();
    // };
    const addTrade = (e) => {
        e.preventDefault();
        const trimmedInput = tradeInput.trim();
        if (trimmedInput !== "" && !formData.trades.includes(trimmedInput)) {
            if (formData.trades.length < 5) {
                setFormData((prev) => ({
                    ...prev,
                    trades: [...prev.trades, trimmedInput],
                }));
                setErrors(prev => ({ ...prev, trades: "" }));
            } else {
                setErrors(prev => ({ ...prev, trades: "Maximum 5 trades allowed" }));
            }
        }
        setTradeInput("");
    };


    const removeTrade = (trade) => {
        setFormData((prev) => ({
            ...prev,
            trades: prev.trades.filter((t) => t !== trade),
        }));
        if (formData.trades.length <= 5) {
            setErrors(prev => ({ ...prev, trades: "" }));
        }
    };

    const addSkill = (e) => {
        e.preventDefault();
        const trimmedInput = skillInput.trim();
        if (trimmedInput !== "" && !formData.skills.includes(trimmedInput)) {
            if (formData.skills.length < 15) {
                setFormData((prev) => ({
                    ...prev,
                    skills: [...prev.skills, trimmedInput],
                }));
                setErrors(prev => ({ ...prev, skills: "" }));
            } else {
                setErrors(prev => ({ ...prev, skills: "Maximum 15 skills allowed" }));
            }
        }
        setSkillInput("");
    };

    const removeSkill = (skill) => {
        setFormData((prev) => ({

            skills: prev.skills.filter((s) => s !== skill),
        }));
        if (formData.skills.length <= 15) {
            setErrors(prev => ({ ...prev, skills: "" }));
        }
    };

    const handleFinish = async () => {
        if (isSubmitting) return;

        if (validateAllSteps()) {
            setIsSubmitting(true);
            try {
                const payload = {
                    user_type: "tradesperson",
                    name: formData.name,
                    title: formData.title,
                    description: formData.description,
                    phone: "",
                    profile_pictures: selectedImage || "",
                    cscs_file: cscsBase64 || "",
                    cscs_file_name: cscsFileName,
                    location: formData.location,
                    radius: formData.radius,
                    lat: formData.position ? formData.position[0] : null,
                    long: formData.position ? formData.position[1] : null,
                    min_hour_rate: parseFloat(formData.hourlyRate) || 0,
                    availability: formData.availability,
                    trade: formData.trades,
                    skill: formData.skills,
                    profile_status: "completed"
                };

                const response = await CreateUsers(payload);

                if (response.success) {
                    await localStorage.setItem("profilepictures", response.data?.profile_pictures);
                    await localStorage.setItem("username", response.data?.name)
                    localStorage.setItem("tradeFormCompleted", "true");
                    if (response.data?.is_cscsfile_verified === "verified") {
                        toast.success("CSCS Verification successfully!");
                        navigate("/tradesperson/jobs");
                    } else {
                        toast.success("User created successfully!");
                        setIsFinished(true);
                    }

                    console.log("User created successfully:", response.data);
                } else {
                    console.error("API Error:", response.message);
                    toast.error("Failed to create user: " + (response.message || "Unknown error"));
                }
            } catch (error) {
                console.error("Error creating user:", error);
                toast.error("An error occurred while creating the user. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setCurrentStep(1);
        }
    };
    const handleNext = () => {
        let isValid = true;

        switch (currentStep) {
            case 1:
                isValid = validateStep1();
                break;
            case 2:
                isValid = validateStep2();
                break;
            case 3:
                isValid = validateStep3();
                break;
            case 4:
                isValid = validateStep4();
                break;
            default:
                isValid = true;
        }

        if (isValid) {
            if (currentStep < 4) {
                setCurrentStep(currentStep + 1);
            } else {
                handleFinish();
            }
        } else {
            console.log(`Please fix the errors in step ${currentStep}`);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            // Navigate to home page when on first step
            navigate("/");
        }
    };

    const setMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newPosition = [latitude, longitude];

                    setFormData(prev => ({
                        ...prev,
                        position: newPosition,
                        location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                    }));
                    setErrors(prev => ({ ...prev, location: "" }));

                    if (mapRef.current) {
                        mapRef.current.setView(newPosition, 13);
                    }
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to get your location. Please enter it manually.");
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handleMapClick = (latlng) => {
        setFormData(prev => ({
            ...prev,
            position: [latlng.lat, latlng.lng],
            location: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`
        }));
        setErrors(prev => ({ ...prev, location: "" }));
    };

    const handlePlaceChanged = () => {
        try {
            const place = autocompleteRef.current.getPlace();
            if (place && place.geometry) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const address = place.formatted_address;

                setFormData(prev => ({
                    ...prev,
                    position: [lat, lng],
                    location: address
                }));
                setErrors(prev => ({ ...prev, location: "" }));

                if (mapRef.current) {
                    mapRef.current.setView([lat, lng], 13);
                }
            } else {
                setErrors(prev => ({ ...prev, location: "Please select a valid address" }));
            }
        } catch (error) {
            console.error("Error in handlePlaceChanged:", error);
            setErrors(prev => ({ ...prev, location: "Failed to retrieve address details" }));
        }
    };

    const [isMdScreen, setIsMdScreen] = useState(false);

    useEffect(() => {
        const checkScreen = () => {
            setIsMdScreen(window.innerWidth >= 640 && window.innerWidth < 1024);
        };
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    const handleMapsLoadError = (error) => {
        console.error("Google Maps API failed to load:", error);
        setMapsError("Failed to load Google Maps. Please check your API key or internet connection.");
    };

    if (isFinished) {
        return (
            <div className="flex flex-col lg:flex-row h-screen w-full p-2 sm:p-4 md:p-5 bg-gray-100">
                <div className="hidden lg:flex flex-[1110] h-full items-center justify-center rounded-[15px] xl:rounded-[20px] 2xl:rounded-[30px] overflow-hidden">
                    <img
                        src={onboardImage}
                        alt="Onboarding illustration"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div
                    className="flex-[750] flex items-center justify-center rounded-[15px] xl:rounded-[20px] 2xl:rounded-[30px] lg:ml-3 xl:ml-5 bg-cover bg-center relative h-screen lg:h-full"
                    style={{ backgroundImage: `url(${onboardbackground})` }}
                >
                    <div className="absolute inset-0 bg-white/80 rounded-[15px] xl:rounded-[20px] 2xl:rounded-[30px]" />
                    <div className="w-full h-full relative z-10 flex flex-col p-4 sm:p-6 md:p-8 lg:p-10 max-w-none">
                        <div className="flex items-center justify-center py-4">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-[120px] sm:w-[160px] md:w-[200px] h-auto"
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center flex-1">
                            <h2 className="font-inter font-semibold text-xl min-[1025px]:text-3xl leading-snug text-center text-[#1A202C] mt-[16px]">
                                Upload your CSCS Card to Get Started
                            </h2>
                            <p className="font-inter font-medium text-base min-[1025px]:text-xl leading-[24px] text-center text-[#718096] mt-[10px] mb-12">

                                Your CSCS card helps confirm your qualifications.
                            </p>
                            <div className="w-full h-full bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col items-center justify-center text-center">
                                <div className="mb-6">
                                    <div className="bg-[#FF5800] p-4 rounded-2xl mx-auto w-16 h-16 flex items-center justify-center">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.1818 17.457C14.0228 18.351 13.1688 19 12.1528 19C11.3308 19 10.5588 18.669 10.0348 18.091C9.80376 17.837 9.82276 17.444 10.0768 17.214C10.3308 16.983 10.7238 17.002 10.9538 17.256C11.2388 17.57 11.6858 17.757 12.1508 17.757C12.5968 17.757 12.9098 17.493 12.9558 17.238C13.0168 16.895 12.5068 16.679 12.3488 16.62C11.6008 16.344 10.9268 16.043 10.9268 16.043C10.3308 15.663 10.0678 15.08 10.1538 14.473C10.2468 13.827 10.7188 13.301 11.3858 13.1C12.6958 12.705 13.7798 13.596 13.8238 13.634L13.8268 13.636C14.0878 13.856 14.1218 14.246 13.9018 14.507L13.8968 14.512C13.6768 14.773 13.2878 14.807 13.0268 14.587C13.0018 14.567 12.3978 14.095 11.7438 14.289C11.4528 14.377 11.3948 14.57 11.3838 14.648C11.3758 14.707 11.3708 14.852 11.5128 14.949C11.5288 14.949 12.1238 15.211 12.7778 15.453C13.9938 15.902 14.2988 16.781 14.1778 17.455L14.1818 17.457ZM8.18376 17.026C7.95676 17.026 7.74476 17.147 7.63876 17.348C7.51476 17.584 7.26076 17.75 6.97376 17.755C6.57476 17.748 6.25276 17.424 6.25376 17.023C6.25376 16.886 6.24676 15.105 6.24576 15.01C6.24476 14.609 6.56676 14.285 6.96576 14.278C7.25276 14.283 7.50676 14.449 7.63076 14.685C7.73676 14.886 7.94876 15.007 8.17576 15.007C8.64576 15.007 8.94676 14.506 8.72576 14.091C8.39076 13.463 7.72276 13.033 6.95376 13.033C5.87376 13.033 4.99776 13.909 4.99776 14.989L5.00576 17.044C5.00576 18.124 5.88176 19 6.96176 19C7.72976 19 8.39876 18.570 8.73376 17.942C8.95476 17.527 8.65376 17.026 8.18376 17.026ZM18.1908 13.033H18.1788C17.8928 13.033 17.6468 13.234 17.5878 13.513L17.0078 16.296L16.3018 13.489C16.2348 13.221 15.9928 13.033 15.7168 13.033C15.3238 13.033 15.0358 13.403 15.1318 13.784L16.2968 18.41C16.3838 18.757 16.6958 19 17.0538 19C17.4238 19 17.7428 18.741 17.8178 18.379L18.7818 13.76C18.8598 13.385 18.5738 13.033 18.1908 13.033ZM21.9988 10.485V19C21.9988 21.757 19.7558 24 16.9988 24H6.99976C4.24276 24 1.99976 21.757 1.99976 19V5C1.99976 2.243 4.24276 0 6.99976 0H11.5148C13.3848 0 15.1428 0.729 16.4648 2.051L19.9488 5.535C21.2708 6.857 21.9988 8.615 21.9988 10.485ZM15.0498 3.464C14.7318 3.146 14.3788 2.877 13.9988 2.658V6.999C13.9988 7.551 14.4468 7.999 14.9988 7.999H19.3398C19.1218 7.619 18.8518 7.266 18.5338 6.948L15.0498 3.464ZM19.9988 10.485C19.9988 10.322 19.9908 10.16 19.9758 10H14.9988C13.3448 10 11.9988 8.654 11.9988 7V2.023C11.8388 2.008 11.6768 2 11.5138 2H6.99876C5.34476 2 3.99876 3.346 3.99876 5V19C3.99876 20.654 5.34476 22 6.99876 22H16.9988C18.6528 22 19.9988 20.654 19.9988 19V10.485Z" fill="white" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="font-inter font-semibold text-[24px] leading-[32px] tracking-normal text-[#1A202C] mb-3">
                                    Card Uploaded
                                </h3>
                                <p className="font-inter font-medium text-[16px] leading-[24px] tracking-normal text-[#718096] mb-6">
                                    Your CSCS card has been uploaded. Our team will verify it shortly.
                                </p>
                                <div className="inline-flex items-center text-[#F54900] px-4 py-2 rounded-full text-sm font-medium border border-[#F54900] cursor-pointer">
                                    <span className="mr-2">Pending Review ⏳</span>
                                    <div className="flex space-x-1"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <LoadScript
            googleMapsApiKey="AIzaSyAj1Wql0HWIdDEoTJ8jh3yKRyZYhjc6sL4"
            libraries={libraries}
            onError={handleMapsLoadError}
        >
            <div className="flex flex-col lg:flex-row h-screen w-full p-2 sm:p-4 md:p-5 bg-gray-100">
                <div className="hidden lg:flex flex-[7] h-full items-center justify-center rounded-[15px] xl:rounded-[20px] 2xl:rounded-[30px] overflow-hidden bg-black">
                    <img src={onboardImage} alt="Onboarding illustration" className="w-full h-full object-cover" />
                </div>
                <div
                    className="flex flex-[5] items-center justify-center rounded-[15px] xl:rounded-[20px] 2xl:rounded-[30px] lg:ml-3 xl:ml-5 bg-cover bg-center relative h-full lg:h-full"
                    style={{ backgroundImage: `url(${onboardbackground})` }}
                >
                    <div className="absolute inset-0 bg-white/80 rounded-[15px] xl:rounded-[20px] 2xl:rounded-[30px]" />
                    <div className="w-full h-full relative z-10 flex flex-col max-w-none">
                        <div className="flex items-center justify-center py-5 sm:py-10 flex-shrink-0">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-[100px] sm:w-[140px] md:w-[180px] lg:w-[120px] xl:w-[160px] 2xl:w-[220px] h-auto"
                            />
                        </div>
                        <div className="w-full px-4 max-w-4xl mx-auto my-1 min-[1440px]:my-6">
                            <Stepper
                                activeStep={currentStep - 1}
                                alternativeLabel={!isSmallScreen}
                                orientation={isSmallScreen ? "vertical" : "horizontal"}
                                connector={isSmallScreen ? null : <DottedConnector />}
                            >
                                {steps.map((label, index) => (
                                    <Step key={index}>
                                        <StepLabel
                                            StepIconComponent={(props) => (
                                                <BigStepIcon {...props}>{index + 1}</BigStepIcon>
                                            )}
                                        >
                                            {label}
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </div>

                        <div className="flex-1 min-h-0 flex flex-col overflow-hidden pt-2 lg:pt-6 px-2 sm:px-4 md:px-5 lg:px-2 xl:px-6">
                            {mapsError && currentStep === 3 ? (
                                <div className="bg-white border border-[#D8DDE6] w-full h-full rounded-[12px] p-4 flex flex-col items-center justify-center">
                                    <p className="text-red-500 text-center">{mapsError}</p>
                                    <p className="text-gray-600 text-center mt-2">
                                        Please enter coordinates manually or try again later.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {currentStep === 1 && (
                                        <div className="bg-white border border-[#D8DDE6] w-full h-full rounded-[12px] p-4 flex flex-col">
                                            <h3 className="font-bold text-lg text-[#1A202C] mb-5">
                                                Basic Information
                                            </h3>
                                            <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
                                                <div className="flex flex-col items-center justify-center min-[1440px]:py-4">
                                                    <div className={`relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full flex items-center justify-center transition-colors ${previewUrl
                                                        ? "border-none bg-transparent"
                                                        : errors.image
                                                            ? "border-2 border-red-500 bg-red-50"
                                                            : "border-2 border-dashed border-[#D8DDE6] bg-[#F6F6F7]"
                                                        }`}>
                                                        {previewUrl ? (
                                                            <>
                                                                <img
                                                                    src={previewUrl}
                                                                    alt="Profile Preview"
                                                                    className="w-full h-full rounded-full object-cover cursor-pointer"
                                                                />
                                                                <button
                                                                    onClick={handleRemoveImage}
                                                                    className="absolute -top-2 -right-1 bg-white border border-gray-300 shadow-md text-red-500 rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                                                                >
                                                                    <IoClose className="w-5 h-5" />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <img
                                                                    src={profileicon}
                                                                    alt="Profile Icon"
                                                                    className="w-5 h-5 sm:w-6 sm:h-6"
                                                                />
                                                                <label
                                                                    htmlFor="image-upload"
                                                                    className="absolute inset-0 flex items-center justify-center cursor-pointer bg-gray-500 bg-opacity-20 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                                                                >
                                                                    <span className="text-white text-[10px] sm:text-xs">Upload</span>
                                                                </label>
                                                            </>
                                                        )}
                                                        <input
                                                            id="image-upload"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="hidden"
                                                        />
                                                    </div>

                                                    {errors.image && (
                                                        <p className="text-red-500 text-xs mt-2 text-center w-full max-w-[200px]">
                                                            {errors.image}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    <div>
                                                        <div className="flex justify-between items-center">
                                                            <label className="block text-[#1A202C] text-[14px] sm:text-[16px] font-medium leading-[20px] sm:leading-[24px] pb-[6px] sm:pb-[8px]">
                                                                Name <span className="text-red-500">*</span>
                                                            </label>
                                                            <span className="text-xs text-gray-500">
                                                                {formData.name.length}/30
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter your name (2-50 characters)"
                                                            value={formData.name}
                                                            onChange={(e) => handleNameChange(e.target.value)}
                                                            className={`w-full h-[40px] sm:h-[50px] px-2 sm:px-3 py-1 sm:py-2 text-sm border rounded-lg placeholder:text-gray-400 ${errors.name ? "border-red-500 " : "border-gray-300"
                                                                }`}
                                                            maxLength={30}
                                                        />
                                                        {errors.name && (
                                                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between items-center">
                                                            <label className="block text-[#1A202C] text-[14px] sm:text-[16px] font-medium leading-[20px] sm:leading-[24px] pb-[6px] sm:pb-[8px]">
                                                                Title <span className="text-red-500">*</span>
                                                            </label>
                                                            <span className="text-xs text-gray-500">
                                                                {formData.title.length}/100
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter title (2-100 characters)"
                                                            value={formData.title}
                                                            onChange={(e) => handleTitleChange(e.target.value)}
                                                            className={`w-full h-[40px] sm:h-[50px] px-2 sm:px-3 py-1 sm:py-2 text-sm border rounded-lg placeholder:text-gray-400 ${errors.title ? "border-red-500 " : "border-gray-300"
                                                                }`}
                                                            maxLength={100}
                                                        />
                                                        {errors.title && (
                                                            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between items-center">
                                                            <label className="block text-[#1A202C] text-[14px] sm:text-[16px] font-medium leading-[20px] sm:leading-[24px] pb-[6px] sm:pb-[8px]">
                                                                Description <span className="text-red-500">*</span>
                                                            </label>
                                                            <span className="text-xs text-gray-500">
                                                                {formData.description.length}/500
                                                            </span>
                                                        </div>
                                                        <textarea
                                                            placeholder="Enter description (10-500 characters)"
                                                            value={formData.description}
                                                            onChange={(e) => handleDescriptionChange(e.target.value)}
                                                            className={`w-full h-[80px] sm:h-[100px] px-2 sm:px-3 py-1 sm:py-2 text-sm border rounded-lg placeholder:text-gray-400 resize-none ${errors.description ? "border-red-500 " : "border-gray-300"
                                                                }`}
                                                            maxLength={500}
                                                        />
                                                        {errors.description && (
                                                            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                                                        )}
                                                    </div>
                                                    <div className="mt-0">
                                                        <label className="block text-[#1A202C] text-[14px] sm:text-[16px] font-medium leading-[20px] sm:leading-[24px] pb-[6px] sm:pb-[8px]">
                                                            Upload CSCS file or PDF <span className="text-red-500">*</span>
                                                        </label>
                                                        <div
                                                            className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center cursor-pointer transition-all duration-200 ${isDragOver
                                                                ? "border-blue-400 bg-blue-50"
                                                                : errors.cscs
                                                                    ? "border-red-500 bg-red-50"
                                                                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"}`}
                                                            onDragOver={handleCscsDragOver}
                                                            onDragLeave={handleCscsDragLeave}
                                                            onDrop={handleCscsDrop}
                                                            onClick={handleBrowseClick}
                                                        >
                                                            <div className="flex flex-col items-center justify-center">
                                                                <div className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 relative">
                                                                    <div className="w-[48px] h-[48px] rounded-lg flex items-center justify-center">
                                                                        <img src={cscs} alt="cscs" className="" />
                                                                    </div>
                                                                </div>
                                                                <p className="font-semibold text-lg leading-7 text-gray-900 text-center mb-1 sm:mb-2">
                                                                    Drag & Drop your CSCS file or PDF here, or{" "}
                                                                    <span className="font-inter font-semibold text-lg leading-7 text-[#155DFC] cursor-pointer hover:text-blue-600">
                                                                        browse
                                                                    </span>
                                                                </p>
                                                                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                                                                    Supports : CSCS, PDF (Max: 10MB for PDF, 5MB for others)
                                                                </p>
                                                                {cscsFileName && (
                                                                    <div className="text-xs sm:text-sm text-gray-700 bg-green-50 px-2 sm:px-3 py-1 rounded-full border border-green-200 flex items-center gap-2">
                                                                        <span>Selected: {cscsFileName}</span>
                                                                        {cscsFile && cscsFile.type === 'application/pdf' && (
                                                                            <span className="text-blue-600 font-medium">(PDF)</span>
                                                                        )}
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setCscsFile(null);
                                                                                setCscsFileName("");
                                                                            }}
                                                                            className="text-red-500 hover:text-red-700 ml-2"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <input
                                                                id="cscs-file-upload"
                                                                type="file"
                                                                accept=".cscs,.pdf,application/pdf"
                                                                onChange={handleCscsFileChange}
                                                                className="hidden"
                                                            />
                                                            <div className="flex justify-center mt-3 sm:mt-4">
                                                                <button
                                                                    onClick={handleTakePhoto}
                                                                    className="flex items-center cursor-pointer justify-center w-[140px] sm:w-[167px] h-[40px] sm:h-[50px] py-2 px-3 sm:px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors gap-2 font-medium text-sm sm:text-base"
                                                                >
                                                                    <svg
                                                                        className="w-4 h-4 sm:w-5 sm:h-5"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                                                        />
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                                                        />
                                                                    </svg>
                                                                    Take Photo
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {errors.cscs && (
                                                            <p className="text-red-500 text-xs mt-1">{errors.cscs}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {currentStep === 2 && (
                                        <div className="bg-white border border-[#D8DDE6] w-full h-full rounded-[12px] p-4 flex flex-col">
                                            <h3 className="font-bold text-[20px] leading-[28px] tracking-normal text-[#1A202C] mb-5">
                                                Trade & Skills Tag
                                            </h3>
                                            <div className="flex-1 overflow-y-auto pr-2">
                                                <div className="mb-6">
                                                    <label className="block font-inter font-medium text-[16px] leading-[24px] tracking-normal text-[#1A202C] mb-2">
                                                        Trade (Typeahead) <span className="text-red-500">*</span>
                                                    </label>
                                                    <div
                                                        className={`border rounded-lg p-2 flex flex-wrap gap-2 min-h-[48px] items-center ${errors.trades ? 'border-red-500' : 'border-gray-300'}`}
                                                    >
                                                        {formData.trades.map((trade) => (
                                                            <span
                                                                key={trade}
                                                                className="bg-[#FF5800] text-white px-3 py-1 rounded-full flex items-center text-sm"
                                                            >
                                                                {trade}
                                                                <button
                                                                    onClick={() => removeTrade(trade)}
                                                                    className="ml-2 text-xs cursor-pointer"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </span>
                                                        ))}
                                                        <form onSubmit={addTrade} className="flex-1 min-w-[120px]">
                                                            <input
                                                                type="text"
                                                                placeholder="Enter trade here..."
                                                                value={tradeInput}
                                                                onChange={(e) => setTradeInput(e.target.value)}
                                                                maxLength={40}
                                                                className="w-full border-none focus:ring-0 text-sm outline-none no-global-style"
                                                            />
                                                        </form>
                                                    </div>
                                                    {errors.trades && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.trades}</p>
                                                    )}
                                                    <p className="font-medium text-[16px] leading-[24px] tracking-normal text-[#718096] mt-1">
                                                        Add up to 5 trades
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block font-inter font-medium text-[16px] leading-[24px] tracking-normal text-[#1A202C] mb-2">
                                                        Skills <span className="text-red-500">*</span>
                                                    </label>
                                                    <div
                                                        className={`border rounded-lg p-2 flex flex-wrap gap-2 min-h-[48px] items-center ${errors.skills ? 'border-red-500' : 'border-gray-300'}`}
                                                    >
                                                        {formData.skills.map((skill) => (
                                                            <span
                                                                key={skill}
                                                                className="bg-[#FF5800] text-white px-3 py-1 rounded-full flex items-center text-sm"
                                                            >
                                                                {skill}
                                                                <button
                                                                    onClick={() => removeSkill(skill)}
                                                                    className="ml-2 text-xs cursor-pointer"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </span>
                                                        ))}

                                                        <form onSubmit={addSkill} className="flex-1">
                                                            <input
                                                                type="text"
                                                                placeholder="Enter skill here..."
                                                                value={skillInput}
                                                                onChange={(e) => setSkillInput(e.target.value)}
                                                                maxLength={40}
                                                                className="w-full border-none focus:ring-0 text-sm outline-none no-global-style break-words truncate min-w-0"
                                                            />
                                                        </form>
                                                    </div>
                                                    {errors.skills && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.skills}</p>
                                                    )}
                                                    <p className="font-medium text-[16px] leading-[24px] tracking-normal text-[#718096] mt-1">
                                                        Add up to 15 skills
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {currentStep === 3 && (
                                        <div className="bg-white border border-[#D8DDE6] w-full h-full rounded-[12px] p-4 flex flex-col">
                                            <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-6 gap-2">
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                                    Location + Travel Radius
                                                </h3>
                                                <button
                                                    onClick={setMyLocation}
                                                    className="flex items-center gap-1 text-[#FF5800] hover:text-[#FF5800] font-medium text-base cursor-pointer"
                                                >
                                                    <HiOutlineMapPin className="w-6 h-6" />
                                                    <span className="hidden sm:inline">Set My Location</span>
                                                    <span className="sm:hidden">Location</span>
                                                </button>
                                            </div>
                                            <div className="space-y-4 flex-1 overflow-y-auto">
                                                <div>
                                                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Location <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={formData.location}
                                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                                        className={`w-full px-3 py-2 sm:py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5800] ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                                                        placeholder="Enter your location"
                                                        aria-label="Enter your location"
                                                        maxLength={140}
                                                    />
                                                    {errors.location && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="radius-input"
                                                        className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2"
                                                    >
                                                        Travel Radius <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="flex">
                                                        <div className="relative flex-1">
                                                            <input
                                                                id="radius-input"
                                                                type="number"
                                                                value={formData.radius}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    if (value === "") {
                                                                        handleInputChange("radius", "");
                                                                    } else if (value.length <= 6) {
                                                                        const num = parseInt(value);
                                                                        if (!isNaN(num)) {
                                                                            handleInputChange("radius", num);
                                                                        }
                                                                    }
                                                                }}
                                                                className={`w-full px-3 py-2.5 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#FF5800] transition-all duration-200 ${errors.radius ? "border-red-500" : "border-gray-300"}`}
                                                                placeholder="Enter radius"
                                                                aria-label="Travel radius in kilometers or miles"
                                                                style={{ borderRight: "none" }}
                                                            />
                                                        </div>

                                                        <div className="relative">
                                                            <select
                                                                value={formData.radiusUnit || "km"}
                                                                onChange={(e) => {
                                                                    handleInputChange("radiusUnit", e.target.value);
                                                                    setErrors((prev) => ({ ...prev, radius: "" }));
                                                                }}
                                                                className="appearance-none bg-white px-4 py-2.5 pr-8 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#FF5800] focus:border-transparent hover:border-gray-400 transition-colors cursor-pointer"
                                                                style={{ borderLeft: "none" }}
                                                                aria-label="Select radius unit"
                                                            >
                                                                <option value="km">km</option>
                                                                <option value="miles">miles</option>
                                                            </select>
                                                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                                <svg
                                                                    className="w-4 h-4 text-gray-400"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {errors.radius && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.radius}</p>
                                                    )}
                                                </div>


                                                <div className="mt-6 flex-shrink-0">
                                                    <div className="h-48 sm:h-64 lg:h-48 xl:h-64">
                                                        <MapContainer
                                                            center={formData.position || [40.7128, -74.0060]}
                                                            zoom={formData.position ? 13 : 12}
                                                            scrollWheelZoom={false}
                                                            className="w-full h-full rounded-lg"
                                                            ref={mapRef}
                                                            whenCreated={(mapInstance) => {
                                                                mapRef.current = mapInstance;
                                                                mapInstance.on('click', (e) => handleMapClick(e.latlng));
                                                            }}
                                                        >
                                                            <TileLayer
                                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                            />
                                                            {formData.position && (
                                                                <Marker
                                                                    position={formData.position}
                                                                    icon={L.icon({
                                                                        iconUrl: markerIcon,
                                                                        iconRetinaUrl: markerIcon2x,
                                                                        shadowUrl: markerShadow,
                                                                        iconSize: [25, 41],
                                                                        iconAnchor: [12, 41],
                                                                        popupAnchor: [1, -34],
                                                                        shadowSize: [41, 41]
                                                                    })}
                                                                >
                                                                    <Popup>
                                                                        Your location: {formData.location}
                                                                    </Popup>
                                                                </Marker>
                                                            )}
                                                            {formData.position && (
                                                                <Circle
                                                                    center={formData.position}
                                                                    radius={formData.radius * (formData.radiusUnit === 'km' ? 1000 : 1609)}
                                                                    pathOptions={{
                                                                        color: '#FF5800',
                                                                        fillColor: '#FF5800',
                                                                        fillOpacity: 0.2,
                                                                        weight: 2
                                                                    }}
                                                                />
                                                            )}
                                                        </MapContainer>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {currentStep === 4 && (
                                        <div className="bg-white border border-[#D8DDE6] w-full h-full rounded-[12px] p-4 flex flex-col">
                                            <h3 className="font-bold text-[20px] leading-[28px] tracking-normal text-[#1A202C] mb-5">
                                                Rate & Availability
                                            </h3>
                                            <div className="flex-1 overflow-y-auto pr-2">
                                                <div className="mb-6">
                                                    <label className="block font-inter font-medium text-[16px] leading-[24px] tracking-normal text-[#1A202C] mb-2">
                                                        Minimum Hourly Rate (USD) <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            placeholder="Enter your min hourly rate"
                                                            value={formData.hourlyRate}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val.split(".")[0].length <= 6) handleInputChange("hourlyRate", val);
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "-" || e.key === "e") {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            className={`pr-7 w-full h-[50px] px-3 py-2 text-sm border rounded-lg outline-none no-spin ${errors.hourlyRate ? 'border-red-500' : 'border-gray-300'}`}
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                            <span className="text-[#1A202C] text-lg">$</span>
                                                        </div>
                                                    </div>
                                                    {errors.hourlyRate && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.hourlyRate}</p>
                                                    )}
                                                </div>
                                                <div className="border-b border-[#D8DDE6] mb-4"></div>
                                                <div>
                                                    <label className="font-bold text-[20px] leading-[28px] tracking-normal text-[#1A202C]">
                                                        Availability
                                                    </label>
                                                    <p className="font-inter font-medium text-[16px] leading-[24px] text-[#1A202C] my-2">
                                                        I can currently work <span className="text-red-500">*</span>
                                                    </p>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                id="More than 30 hrs/week"
                                                                name="availability"
                                                                value="More than 30 hrs/week"
                                                                checked={formData.availability === "More than 30 hrs/week"}
                                                                onChange={() => handleInputChange("availability", "More than 30 hrs/week")}
                                                                className="h-4 w-4 text-slate-800 focus:ring-slate-500 border-gray-300 flex-shrink-0"
                                                            />
                                                            <label htmlFor="More than 30 hrs/week" className="ml-2 block font-inter font-medium text-[16px] leading-[24px] text-[#718096]">
                                                                More than 30 hrs/week
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                id="Less than 30 hrs/week"
                                                                name="availability"
                                                                value="Less than 30 hrs/week"
                                                                checked={formData.availability === "Less than 30 hrs/week"}
                                                                onChange={() => handleInputChange("availability", "Less than 30 hrs/week")}
                                                                className="h-4 w-4 text-slate-800 focus:ring-slate-500 border-gray-300 flex-shrink-0"
                                                            />
                                                            <label
                                                                htmlFor="Less than 30 hrs/week"
                                                                className="ml-2 block font-inter font-medium text-[16px] leading-[24px] text-[#718096]"
                                                            >
                                                                Less than 30 hrs/week
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                id="As needed - open to offer"
                                                                name="availability"
                                                                value="As needed - open to offer"
                                                                checked={formData.availability === "As needed - open to offer"}
                                                                onChange={() => handleInputChange("availability", "As needed - open to offer")}
                                                                className="h-4 w-4 text-slate-800 focus:ring-slate-500 border-gray-300 flex-shrink-0"
                                                            />
                                                            <label htmlFor="as-needed" className="ml-2 block font-inter font-medium text-[16px] leading-[24px] text-[#718096]">
                                                                As needed - open to offer
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                id="None"
                                                                name="availability"
                                                                value="None"
                                                                checked={formData.availability === "None"}
                                                                onChange={() => handleInputChange("availability", "None")}
                                                                className="h-4 w-4 text-slate-800 focus:ring-slate-500 border-gray-300 flex-shrink-0"
                                                            />
                                                            <label htmlFor="None" className="ml-2 block font-inter font-medium text-[16px] leading-[24px] text-[#718096]">
                                                                None
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {errors.availability && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.availability}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="flex flex-row justify-between flex-shrink-0 gap-2 sm:gap-3 py-2 px-2 xl:py-6 xl:px-6">
                            <button
                                onClick={handleBack}
                                className="w-[100px] xl:w-[150px] h-[40px] xl:h-[50px] px-3 py-2 text-sm rounded-lg font-medium bg-white border border-[#D8DDE6] text-gray-700 hover:bg-gray-300 cursor-pointer"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={isSubmitting}
                                className={`w-[100px] xl:w-[150px] h-[40px] xl:h-[50px] px-3 py-2 text-sm rounded-lg font-medium ${currentStep === 4
                                    ? "bg-[#152A45] text-white hover:bg-slate-900"
                                    : "bg-[#152A45] text-white hover:bg-slate-900"
                                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                                {isSubmitting ? "Processing..." : currentStep === 4 ? "Finish" : "Next"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </LoadScript>
    );
};

export default TradeInfo;