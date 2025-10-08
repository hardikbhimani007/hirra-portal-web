import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { MdOutlineEdit } from "react-icons/md";
import { HiOutlineMapPin } from "react-icons/hi2";
import { MapContainer, TileLayer, Marker, Circle, Popup, useMapEvents, useMap } from 'react-leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { CreateUsers } from "../../services/userService";
import { CiUser } from "react-icons/ci";
import { Stepper, Step, StepLabel, StepConnector, stepConnectorClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme, useMediaQuery } from "@mui/material";

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

export default function BasicInfoModal({ onClose, userData, onSaveSuccess }) {
    const modalRef = useRef(null);
    const mapRef = useRef();
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});

    const theme = useTheme();
    const isSmallScreen = useMediaQuery("(max-width:768px)");

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
            borderColor: '#FF5800',
        },
        [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
            borderColor: '#FF5800',
        },
    }));

    const BigStepIcon = styled('div')(({ ownerState }) => {
        let bgColor = '#fff';
        let borderColor = '#E0E0E0';
        let fontColor = '#b3b3b3ff';

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
            border: `1px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            color: fontColor,
            fontWeight: 'bold',
        };
    });
    const parsedTrade = typeof userData.trade === 'string' ? JSON.parse(userData.trade) : userData.trade;
    const parsedSkill = typeof userData.skill === 'string' ? JSON.parse(userData.skill) : userData.skill;
    const [formData, setFormData] = useState({
        name: userData?.name || '',
        title: userData?.title || '',
        description: userData?.description || '',
        trade: parsedTrade || [],
        skill: parsedSkill || [],
        location: userData?.location || '',
        lat: userData?.lat || '',
        lng: userData?.lng || '',
        radius: userData?.radius || 30,
        radiusUnit: "km",
        minimumRate: userData?.min_hour_rate?.toString() || '',
        currency: "$",
        availability: userData?.availability,
        profile_pictures: userData?.profile_pictures || ''
    });
    const [tradeInput, setTradeInput] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const [showTradeSuggestions, setShowTradeSuggestions] = useState(false);
    const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
    const [image, setImage] = useState(userData?.profile_pictures || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // console.log(userData)
        if (userData) {
            setFormData({
                name: userData.name || '',
                title: userData.title || '',
                description: userData.description || '',
                trade: parsedTrade || [],
                skill: parsedSkill || [],
                location: userData.location || '',
                lat: userData?.lat || '',
                lng: userData?.lng || '',
                radius: userData.radius?.toString() || '30',
                radiusUnit: "km",
                minimumRate: userData.min_hour_rate?.toString() || '',
                currency: "$",
                availability: userData.availability || "more-than-30",
                profile_pictures: userData.profile_pictures || ''
            });
            setImage(userData.profile_pictures || '');
        }
    }, [userData]);

    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setFormData(prev => ({
                    ...prev,
                    profile_pictures: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const allTrades = [
        'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Roofer', 'Mason', 'Welder',
        'HVAC Technician', 'Flooring Installer', 'Drywall Installer', 'Glazier', 'Insulation Worker'
    ];

    const allSkills = [
        'Wiring lighting circuits', 'Installing boilers', 'Tiling floors', 'Blueprint reading',
        'Pipe fitting', 'Cabinet installation', 'Concrete pouring', 'Electrical troubleshooting',
        'Plumbing repair', 'Framing', 'Roofing installation', 'Safety protocols', 'Tool maintenance',
        'Quality control', 'Project management', 'Customer service'
    ];

    const currencies = ['$', '€', '£', '¥', '₹'];

    const availabilityOptions = [
        { value: 'More than 30 hrs/week', label: 'More than 30 hrs/week' },
        { value: 'Less than 30 hrs/week', label: 'Less than 30 hrs/week' },
        { value: 'As needed - open to offer', label: 'As needed - open to offer' },
        { value: 'None', label: 'None' }
    ];

    const steps = [
        { number: 1, label: 'Basic Info.', active: true },
        { number: 2, label: 'Trade & Skills', active: false },
        { number: 3, label: 'Location & Travel Radius', active: false },
        { number: 4, label: 'Rate & Availability', active: false }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addTrade = (trade) => {
        if (trade && !formData.trade?.includes(trade)) {
            setFormData(prev => ({
                ...prev,
                trade: [...prev.trade, trade]
            }));
        }
        setTradeInput('');
        setShowTradeSuggestions(false);
    };

    const removeTrade = (tradeToRemove) => {
        setFormData(prev => ({
            ...prev,
            trade: prev.trade.filter(trade => trade !== tradeToRemove)
        }));
    };

    const addSkill = (skill) => {
        if (skill && !formData.skill.includes(skill) && formData.skill.length < 15) {
            setFormData(prev => ({
                ...prev,
                skill: [...prev.skill, skill]
            }));
        }
        setSkillInput('');
        setShowSkillSuggestions(false);
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skill: prev.skill.filter(skill => skill !== skillToRemove)
        }));
    };

    const filteredTrades = allTrades.filter(trade =>
        trade.toLowerCase().includes(tradeInput.toLowerCase()) &&
        !formData.trade.includes(trade)
    );

    const filteredSkills = allSkills.filter(skill =>
        skill.toLowerCase().includes(skillInput.toLowerCase()) &&
        !formData.skill.includes(skill)
    );

    const handleTradeKeyPress = (e) => {
        if (e.key === 'Enter' && tradeInput.trim()) {
            e.preventDefault();
            addTrade(tradeInput.trim());
        }
    };

    const handleSkillKeyPress = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            addSkill(skillInput.trim());
        }
    };

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const saveData = {
                name: formData.name,
                title: formData.title,
                description: formData.description,
                skill: formData.skill,
                trade: formData.trade,
                location: formData.location,
                radius: parseInt(formData.radius) || 0,
                min_hour_rate: parseFloat(formData.minimumRate) || 0,
                availability: formData.availability,
                profile_pictures: formData.profile_pictures
            };

            await CreateUsers(saveData);

            setTimeout(() => {
                if (onSaveSuccess) onSaveSuccess();
                onClose();
                setIsSaving(false);
            }, 2000);

        } catch (error) {
            console.error('Failed to save profile:', error);
            setIsSaving(false);
        }
    };


    const closeModal = () => {
        if (onClose) onClose();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function RecenterMap({ lat, lng }) {
        const map = useMap();
        useEffect(() => {
            if (lat && lng) {
                map.setView([lat, lng], map.getZoom(), { animate: true });
            }
        }, [lat, lng]);
        return null;
    }


    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setFormData(prev => ({
                    ...prev,
                    lat,
                    lng
                }));
                updateLocationName(lat, lng);
            }
        });

        if (!formData.lat || !formData.lng) return null;

        return (
            <Marker
                position={[formData.lat, formData.lng]}
                draggable={true}
                eventHandlers={{
                    dragend: (e) => {
                        const { lat, lng } = e.target.getLatLng();
                        setFormData(prev => ({
                            ...prev,
                            lat,
                            lng
                        }));
                        updateLocationName(lat, lng);
                    }
                }}
            >
                <Popup>{formData.location}</Popup>
            </Marker>
        );
    };

    const updateLocationName = async (lat, lng) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            if (res.ok) {
                const data = await res.json();
                const locationName = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                setFormData(prev => ({
                    ...prev,
                    location: locationName
                }));
            }
        } catch (err) {
            console.warn("Reverse geocoding failed, using coordinates", err);
            setFormData(prev => ({
                ...prev,
                location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
            }));
        }
    };

    const setMyLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                setFormData(prev => ({
                    ...prev,
                    lat: latitude,
                    lng: longitude,
                    location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                }));

                if (mapRef.current) {
                    mapRef.current?.setView([latitude, longitude], 13);
                }

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    if (res.ok) {
                        const data = await res.json();
                        const locationName = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                        setFormData(prev => ({
                            ...prev,
                            location: locationName
                        }));
                    }
                } catch (err) {
                    console.warn("Reverse geocoding failed, using coordinates", err);
                }

                setErrors(prev => ({ ...prev, location: "" }));
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Unable to get your location. Please enter it manually.");
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/40">
            <div ref={modalRef} className="bg-white rounded-xl w-full max-w-3xl shadow-2xl flex flex-col min-h-[90vh] max-h-[90vh]">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Edit Profile</h2>
                    <button
                        onClick={closeModal}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="w-full px-4 max-w-3xl mx-auto my-4">
                    <Stepper
                        activeStep={currentStep - 1}
                        alternativeLabel={false}
                        orientation="horizontal"
                        connector={isSmallScreen ? null : <DottedConnector />}
                        sx={{
                            display: 'flex',
                            justifyContent: isSmallScreen ? 'flex-start' : 'space-between',
                            flexWrap: isSmallScreen ? 'wrap' : 'nowrap',
                            gap: isSmallScreen ? '12px' : 0,
                        }}
                    >
                        {steps.map((step, index) => (
                            <Step key={step.number}>
                                <StepLabel
                                    StepIconComponent={(props) => <BigStepIcon {...props}>{index + 1}</BigStepIcon>}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        '& .MuiStepLabel-label': {
                                            ml: 0.2,
                                        },
                                    }}
                                >
                                    {step.label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </div>

                <div className="p-4 sm:p-6 overflow-auto flex-1 space-y-6">
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Basic Information</h3>

                            <div className="flex justify-center mb-4 sm:mb-6">
                                <div className="relative">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 overflow-hidden">
                                        {image ? (
                                            <img
                                                src={image}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <CiUser className="w-21 h-21 pl-3 pt-2  text-gray-400" />
                                        )}
                                    </div>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />

                                    <button
                                        onClick={handleButtonClick}
                                        className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
                                    >
                                        <MdOutlineEdit className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                        Name
                                    </label>
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            maxLength={30}
                                            className="w-full pr-12 px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your name"
                                        />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                                            {formData.name.length}/30
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                        Title
                                    </label>
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            maxLength={100}
                                            className="w-full pr-16 px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your job title"
                                        />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                                            {formData.title.length}/100
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                        Description
                                    </label>
                                    <div className="relative w-full">
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            rows={4}
                                            maxLength={500}
                                            className="w-full pr-16 px-3 py-2 sm:py-2.5 h-45 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            placeholder="Describe your experience and skills"
                                        />
                                        <span className="absolute right-3 bottom-2 text-xs text-gray-500">
                                            {formData.description.length}/500
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="overflow-auto flex-1 space-y-6">
                            <div className="space-y-6">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Trade & Skills</h3>

                                <div className="space-y-3">
                                    <label className="block text-sm sm:text-base font-medium text-gray-700">
                                        Trade (Typeahead)
                                    </label>
                                    <div className="border border-gray-300 rounded-lg p-2 flex flex-wrap gap-2 min-h-[48px] items-center">
                                        {formData?.trade?.map((trade) => (
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

                                        {formData?.trade?.length < 5 && (
                                            <div className="flex-grow min-w-[120px]">
                                                <input
                                                    type="text"
                                                    placeholder="Enter trade here..."
                                                    value={tradeInput}
                                                    onChange={(e) => {
                                                        if (e.target.value.length <= 40) {
                                                            setTradeInput(e.target.value);
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (
                                                            e.key === 'Enter' &&
                                                            tradeInput.trim() !== '' &&
                                                            formData.trade.length < 5
                                                        ) {
                                                            setFormData({
                                                                ...formData,
                                                                trade: [...formData.trade, tradeInput.trim()],
                                                            });
                                                            setTradeInput('');
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    className="w-full text-sm no-global-style"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Add up to 5 skills ({formData?.trade?.length}/5)
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm sm:text-base font-medium text-gray-700">
                                        Skill
                                    </label>
                                    <div className="border border-gray-300 rounded-lg p-2 flex flex-wrap gap-2 min-h-[48px] items-center">
                                        {formData.skill.map((skill) => (
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

                                        {formData.skill.length < 15 && (
                                            <div className="flex-grow min-w-[120px]">
                                                <input
                                                    type="text"
                                                    placeholder="Enter skill here..."
                                                    value={skillInput}
                                                    onChange={(e) => {
                                                        if (e.target.value.length <= 40) setSkillInput(e.target.value);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (
                                                            e.key === 'Enter' &&
                                                            skillInput.trim() !== '' &&
                                                            formData.skill.length < 15
                                                        ) {
                                                            setFormData({
                                                                ...formData,
                                                                skill: [...formData.skill, skillInput.trim()],
                                                            });
                                                            setSkillInput('');
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    className="w-full text-sm no-global-style"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Add up to 15 skills ({formData.skill.length}/15)
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                    Location + Travel Radius
                                </h3>
                                <button
                                    onClick={setMyLocation}
                                    className="flex items-center gap-2 text-[#FF5800] font-medium text-base cursor-pointer"
                                >
                                    <HiOutlineMapPin className="w-6 h-6" />
                                    Set My Location
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your location"
                                        maxLength={140}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Radius</label>
                                    <div className="flex">
                                        <input
                                            type="number"
                                            value={formData.radius}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === "") {
                                                    handleInputChange('radius', "");
                                                } else if (value.length <= 6) {
                                                    const num = parseInt(value);
                                                    if (!isNaN(num)) {
                                                        handleInputChange('radius', num);
                                                    }
                                                }
                                            }}
                                            className="flex-1 px-3 py-2.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="30"
                                            aria-label="Radius"
                                        />
                                        <select
                                            value={formData.radiusUnit}
                                            onChange={(e) => handleInputChange('radiusUnit', e.target.value)}
                                            className="px-4 py-2.5 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                                        >
                                            <option value="km">km</option>
                                            <option value="miles">miles</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <MapContainer
                                        center={formData.lat && formData.lng ? [formData.lat, formData.lng] : [28.6139, 77.209]}
                                        zoom={12}
                                        scrollWheelZoom={false}
                                        className="w-full h-64 sm:h-80 rounded-lg"
                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationMarker />
                                        {formData.lat && formData.lng && (
                                            <>
                                                <Marker
                                                    position={[formData.lat, formData.lng]}
                                                    draggable={true}
                                                    eventHandlers={{
                                                        dragend: (e) => {
                                                            const { lat, lng } = e.target.getLatLng();
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                lat,
                                                                lng,
                                                                location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
                                                            }));
                                                        }
                                                    }}
                                                >
                                                    <Popup>{formData.location}</Popup>
                                                </Marker>

                                                <Circle
                                                    key={`${formData.lat}-${formData.lng}-${formData.radius}-${formData.radiusUnit}`}
                                                    center={[formData.lat, formData.lng]}
                                                    radius={formData.radius * (formData.radiusUnit === 'km' ? 1000 : 1609.34)}
                                                    pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
                                                />
                                            </>
                                        )}

                                        {formData.lat && formData.lng && <RecenterMap lat={formData.lat} lng={formData.lng} />}
                                    </MapContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Rate + Availability</h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                        Minimum Hourly Rate
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="Enter your min hourly rate"
                                            value={formData.minimumRate}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === "") {
                                                    handleInputChange("minimumRate", "");
                                                } else {
                                                    const [integerPart, decimalPart] = value.split(".");
                                                    if (integerPart.length <= 6 && (!decimalPart || decimalPart.length <= 2)) {
                                                        handleInputChange("minimumRate", value);
                                                    }
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="pr-7 w-full h-[50px] px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none"
                                            min="0"
                                            step="0.01"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-[#1A202C] text-lg">$</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-lg sm:text-xl font-bold text-gray-900 pb-4 sm:pb-6">
                                        Availability
                                    </label>
                                    <p className="text-base text-gray-700 mt-4 pb-2">I can currently work</p>
                                    <div className="space-y-3">
                                        {availabilityOptions.map((option) => (
                                            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="availability"
                                                    value={option.value}
                                                    checked={formData.availability === option.value}
                                                    onChange={(e) => handleInputChange('availability', e.target.value)}
                                                    className="w-4 h-4 border-[#152A45]"
                                                />
                                                <span className="text-sm sm:text-base text-[#152A45]">
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between px-4 sm:px-6 py-4 border-t border-gray-200 sticky bottom-0 bg-white z-10 rounded-xl text-base">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className={`px-10 py-2 md:px-18 md:py-3 rounded-md font-medium transition-colors ${currentStep === 1
                            ? 'border border-gray-400 text-gray-400 cursor-not-allowed'
                            : 'border border-gray-400 text-gray-700 hover:bg-gray-100 cursor-pointer'
                            }`}
                    >
                        Back
                    </button>
                    {currentStep < 4 ? (
                        <button
                            onClick={handleNext}
                            className="px-10 py-2 md:px-18 md:py-3 bg-[#152A45] text-white rounded-md font-medium hover:bg-slate-900 transition-colors cursor-pointer"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`px-10 py-2 md:px-18 md:py-3 rounded-md font-medium flex items-center justify-center transition-colors ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#152A45] hover:bg-slate-900 text-white'
                                }`}
                        >
                            {isSaving && (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {!isSaving && 'Save'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}