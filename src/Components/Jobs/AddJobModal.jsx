import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import ProfileImg from "../../assets/Jobs/User1.webp";
import { HiOutlineMapPin } from "react-icons/hi2";
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import JobCards from '../Jobs/JobCards';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CreateJob } from '../../services/jobService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { Stepper, Step, StepLabel, StepConnector, stepConnectorClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme, useMediaQuery } from "@mui/material";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const jobsData = [
    {
        title: "General Labourer",
        Jid: "87435901",
        type: "Green Project",
        postedBy: "Subcontractor",
        rate: 75,
        description: "We're seeking a reliable general labourer to assist with site preparation, material handling, and clean-up on an upcoming residential project. Previous experience is a plus.",
        skills: ["Heavy Lifting", "Site Safety", "Teamwork"],
        location: "822 E. 20th Street. Los Angeles.",
        startDate: "25 February, 2025",
        duration: "3 Weeks",
        isLiked: false,
    }
];

export default function AddJobModal({ onClose, setStateJobs, onSave }) {
    const modalRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: "",
        trades: [],
        skills: [],
        location: "",
        position: null,
        hourlyRate: "",
        isGreenProject: false,
        startDate: "",
        duration: "",
        durationValue: "",
        durationUnit: "Day(s)",
        radius: "",
        radiusUnit: "km",
        minimumRate: "",
        currency: "$",
        availability: ""
    });
    const [tradeInput, setTradeInput] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const [showTradeSuggestions, setShowTradeSuggestions] = useState(false);
    const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
    const [image, setImage] = useState(ProfileImg);
    const fileInputRef = useRef(null);
    const [jobs, setJobs] = useState();
    const [selectedJob, setSelectedJob] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery("(max-width:768px)");

    const TITLE_MIN_CHARS = 10;
    const TITLE_MAX_CHARS = 60;
    const DESC_MIN_CHARS = 50;
    const DESC_MAX_CHARS = 800;
    const MAX_SKILLS = 15;

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

    // Check if form has any data entered
    const checkFormHasData = () => {
        return (
            formData.title.trim() !== '' ||
            formData.description.trim() !== '' ||
            formData.skills.length > 0 ||
            formData.location.trim() !== '' ||
            formData.position !== null ||
            formData.hourlyRate !== '' ||
            formData.startDate !== '' ||
            formData.duration !== '' ||
            formData.isGreenProject
        );
    };

    useEffect(() => {
        setHasUnsavedChanges(checkFormHasData());
    }, [formData]);

    const handleCardClick = (job) => {
        setSelectedJob(job);
        setIsDrawerOpen(true);
    };

    const toggleLike = (jobId) => {
        setJobs(prevJobs =>
            prevJobs.map(job =>
                job.Jid === jobId ? { ...job, isLiked: !job.isLiked } : job
            )
        );
    };

    const mapRef = useRef();
    const handleMapClick = (latlng) => {
        setFormData({
            ...formData,
            position: [latlng.lat, latlng.lng],
            location: `Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)}`,
        });
        if (mapRef.current) mapRef.current.setView([latlng.lat, latlng.lng], 13);
    };

    const setMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newPosition = [latitude, longitude];
                    setFormData({
                        ...formData,
                        position: newPosition,
                        location: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
                    });
                    if (mapRef.current) mapRef.current.setView(newPosition, 13);
                },
                () => toast.error("Failed to get your location"),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
            );
        } else toast.error("Geolocation not supported");
    };

    const steps = [
        { number: 1, label: 'Job Basics' },
        { number: 2, label: 'Location & Schedule' },
        { number: 3, label: 'Pay & Skills' },
        { number: 4, label: 'Preview & Post' }
    ];

    const handleInputChange = (field, value) => {
        if (field === "title") {
            if (value.length <= TITLE_MAX_CHARS) {
                setFormData(prev => ({ ...prev, title: value }));
            }
        } else if (field === "description") {
            if (value.length <= DESC_MAX_CHARS) {
                setFormData(prev => ({ ...prev, description: value }));
            }
        } else if (field === "durationValue" || field === "durationUnit") {
            setFormData(prev => {
                const newFormData = { ...prev, [field]: value };
                if (newFormData.durationValue) {
                    newFormData.duration = `${newFormData.durationValue} ${newFormData.durationUnit}`;
                } else {
                    newFormData.duration = "";
                }
                return newFormData;
            });
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }

        setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const countCharacters = (text) => {
        return text.length;
    };

    const addSkill = (skill) => {
        if (!skill) return;

        if (formData.skills.includes(skill)) {
            toast.error("Skill already added");
            return;
        }

        if (formData.skills.length >= MAX_SKILLS) {
            setErrors(prev => ({ ...prev, skills: `You can add up to ${MAX_SKILLS} skills only` }));
            return;
        }

        setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
        setSkillInput('');
        setShowSkillSuggestions(false);
        setErrors(prev => ({ ...prev, skills: "" }));
    };

    const removeSkill = (skillToRemove) => setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
    const handleSkillKeyPress = (e) => { if (e.key === 'Enter' && skillInput.trim()) { e.preventDefault(); addSkill(skillInput.trim()); } };

    const validateStep = (step) => {
        const newErrors = {};
        if (step === 1) {
            const titleChars = countCharacters(formData.title);
            const descChars = countCharacters(formData.description);

            if (!formData.title.trim()) {
                newErrors.title = "Job title is required";
            } else if (titleChars < TITLE_MIN_CHARS) {
                newErrors.title = `Job title must be at least ${TITLE_MIN_CHARS} characters (currently ${titleChars})`;
            }

            if (!formData.description.trim()) {
                newErrors.description = "Job description is required";
            } else if (descChars < DESC_MIN_CHARS) {
                newErrors.description = `Job description must be at least ${DESC_MIN_CHARS} characters (currently ${descChars})`;
            }
        }
        if (step === 2) {
            if (!formData.location.trim()) newErrors.location = "Location is required";
            if (!formData.startDate) newErrors.startDate = "Start date is required";
            if (!formData.duration.trim()) newErrors.duration = "Duration is required";
        }
        if (step === 3) {
            if (!formData.hourlyRate) newErrors.hourlyRate = "Hourly rate is required";
            if (!formData.hourlyRate || Number(formData.hourlyRate) <= 0) {
                newErrors.hourlyRate = "Hourly rate must be greater than 0";
            }
            if (!formData.skills.length) newErrors.skills = "At least one skill is required";
            if (formData.skills.length > MAX_SKILLS) {
                newErrors.skills = `Maximum ${MAX_SKILLS} skills allowed`;
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => { if (validateStep(currentStep)) setCurrentStep(currentStep + 1); };
    const handleBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                lat: formData.position ? formData.position[0] : null,
                long: formData.position ? formData.position[1] : null,
                hourly_rate: Number(formData.hourlyRate) || 0,
                is_green_project: formData.isGreenProject || false,
                start_date: formData.startDate || new Date().toISOString().split("T")[0],
                duration: formData.duration || "Not specified",
                skills: formData.skills.length > 0 ? formData.skills : ["General Labor"],
            };
            const response = await CreateJob(payload);

            if (onSave) onSave(response.data);
            setStateJobs(prev => [response.data, ...prev]);
            toast.success("Job posted successfully!");
            onClose();
        } catch (err) {
            // toast.error(`${err?.message || "Something went wrong while posting the job. Please try again."}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        if (hasUnsavedChanges) {
            setShowCancelConfirm(true);
        } else {
            onClose();
        }
    };

    const confirmCancel = () => {
        setShowCancelConfirm(false);
        onClose();
    };

    const cancelCancel = () => {
        setShowCancelConfirm(false);
    };

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/40">
                <div ref={modalRef} className="bg-white rounded-xl w-full max-w-4xl shadow-2xl flex flex-col min-h-[90vh] max-h-[90vh]">
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Create New Job</h2>
                        <button onClick={handleCloseModal} className="p-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="w-full px-4 mx-auto my-6">
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

                    <div className="py-2 sm:py-4 px-4 sm:px-6 overflow-auto flex-1 space-y-6">
                        {currentStep === 1 && (
                            <div className="space-y-1 md:space-y-4">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-6">Job Basics</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                            Job Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder='Enter your job title'
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <div className="flex justify-between items-center mt-1">
                                            {errors.title ? (
                                                <p className="text-red-500 text-sm">{errors.title}</p>
                                            ) : (
                                                <p className={`text-sm ${countCharacters(formData.title) >= TITLE_MIN_CHARS && countCharacters(formData.title) <= TITLE_MAX_CHARS
                                                    ? 'text-green-600'
                                                    : 'text-gray-500'
                                                    }`}>
                                                    {countCharacters(formData.title)}/{TITLE_MIN_CHARS}-{TITLE_MAX_CHARS} characters
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                            Job Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            placeholder='Enter job description...'
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            rows={4}
                                            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-80 overflow-y-auto"
                                        />
                                        <div className="flex justify-between items-center mt-1">
                                            {errors.description ? (
                                                <p className="text-red-500 text-sm">{errors.description}</p>
                                            ) : (
                                                <p className={`text-sm ${countCharacters(formData.description) >= DESC_MIN_CHARS && countCharacters(formData.description) <= DESC_MAX_CHARS
                                                    ? 'text-green-600'
                                                    : 'text-gray-500'
                                                    }`}>
                                                    {countCharacters(formData.description)}/{DESC_MIN_CHARS}-{DESC_MAX_CHARS} characters
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-1 md:space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Location & Schedule</h3>
                                    <button onClick={setMyLocation} className="flex items-center gap-1 text-[#FF5800] hover:text-[#FF5800] font-medium text-base cursor-pointer">
                                        <HiOutlineMapPin className="w-6 h-6" />
                                        <span className="hidden sm:inline">Set My Location</span>
                                        <span className="sm:hidden">Location</span>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                            Location <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            maxLength={140}
                                            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your location"
                                        />
                                        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                                    </div>
                                    <div className="h-48 sm:h-64 lg:h-48 xl:h-64">
                                        <MapContainer center={formData.position || [40.7128, -74.006]} zoom={formData.position ? 13 : 12} scrollWheelZoom={false} className="w-full h-full rounded-lg" ref={mapRef} whenCreated={mapInstance => { mapRef.current = mapInstance; mapInstance.on("click", e => handleMapClick(e.latlng)) }}>
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                                            {formData.position && <Marker position={formData.position} icon={L.icon({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] })}><Popup>Your location: {formData.location}</Popup></Marker>}
                                            {formData.position && formData.radius && <Circle center={formData.position} radius={formData.radius * (formData.radiusUnit === "km" ? 1000 : 1609)} pathOptions={{ color: "#FF5800", fillColor: "#FF5800", fillOpacity: 0.2, weight: 2 }} />}
                                        </MapContainer>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                                Start Date <span className="text-red-500">*</span>
                                            </label>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    disablePast
                                                    value={formData.startDate ? dayjs(formData.startDate) : null}
                                                    onChange={(newValue) =>
                                                        handleInputChange(
                                                            "startDate",
                                                            newValue ? newValue.format("YYYY-MM-DD") : ""
                                                        )
                                                    }
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            size: "small",
                                                            InputProps: {
                                                                className: "h-11.5 px-3 py-2 text-sm",
                                                            },
                                                            className: "w-full",
                                                        },
                                                    }}
                                                />
                                            </LocalizationProvider>
                                            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                                Duration <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    placeholder="Enter value"
                                                    value={formData.durationValue}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value.length <= 3) {
                                                            handleInputChange("durationValue", value);
                                                        }
                                                    }}
                                                    onInput={(e) => {
                                                        if (e.target.value.length > 3) {
                                                            e.target.value = e.target.value.slice(0, 3);
                                                        }
                                                    }}
                                                    className="flex-1 px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    min="1"
                                                    max="999"
                                                />
                                                <select
                                                    value={formData.durationUnit}
                                                    onChange={(e) => handleInputChange('durationUnit', e.target.value)}
                                                    className="px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                                >
                                                    <option value="Day(s)">Day(s)</option>
                                                    <option value="Week(s)">Week(s)</option>
                                                </select>
                                            </div>
                                            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="overflow-auto flex-1 space-y-6">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Pay & Skills</h3>
                                <div>
                                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                        Hourly Rate <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="Enter your hourly rate"
                                            value={formData.hourlyRate}
                                            onChange={(e) => {
                                                let value = e.target.value;

                                                const regex = /^\d{0,6}(\.\d{0,2})?$/;

                                                if (value === "" || regex.test(value)) {
                                                    handleInputChange("hourlyRate", value);
                                                }
                                            }}
                                            className="pr-7 w-full h-[50px] px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none no-spin"
                                            min="0"
                                            step="0.01"
                                        />

                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><span className="text-[#1A202C] text-lg">$</span></div>
                                    </div>
                                    {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm sm:text-base font-medium text-gray-700">
                                        Skills <span className="text-red-500">*</span>
                                    </label>
                                    <div className="border border-gray-300 rounded-lg p-2 flex flex-wrap gap-2 min-h-[48px]">
                                        {formData.skills.map(skill => (
                                            <span key={skill} className="bg-[#FF5800] text-white px-3 py-1 rounded-full flex items-center text-sm">
                                                {skill} <button onClick={() => removeSkill(skill)} className="ml-2 text-xs cursor-pointer">✕</button>
                                            </span>
                                        ))}
                                        <input
                                            type="text"
                                            placeholder="Enter skill here..."
                                            value={skillInput}
                                            onChange={(e) => {
                                                if (e.target.value.length <= 30) {
                                                    setSkillInput(e.target.value);
                                                }
                                            }}
                                            onKeyPress={handleSkillKeyPress}
                                            onBlur={() => setShowSkillSuggestions(false)}
                                            onFocus={() => setShowSkillSuggestions(true)}
                                            className="flex-1 min-w-full border-none focus:ring-0 text-sm outline-none no-global-style"
                                        />
                                    </div>
                                    {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                                </div>

                                <div className="flex items-center mt-4">
                                    <span className="text-sm sm:text-lg font-medium text-gray-700">Green Project</span>
                                    <label className="relative inline-flex items-center cursor-pointer mx-4">
                                        <input type="checkbox" checked={formData.isGreenProject} onChange={(e) => handleInputChange("isGreenProject", e.target.checked)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600 transition-all"></div>
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-all"></div>
                                    </label>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-1 md:space-y-4">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Preview & Post</h3>
                                <JobCards
                                    job={{
                                        ...jobsData[0],
                                        title: formData.title || "Job Title",
                                        description: formData.description || "Job description will appear here",
                                        skills: formData.skills.length > 0 ? formData.skills : ["Skills will appear here"],
                                        location: formData.location || "Location not specified",
                                        rate: Number(formData.hourlyRate) || 0,
                                        type: formData.isGreenProject ? "Green Project" : "",
                                        duration: formData.duration || "Duration not specified"
                                    }}
                                    onCardClick={handleCardClick}
                                    toggleLike={toggleLike}
                                    showLike={false}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between px-2 sm:px-6 py-4 border-t border-gray-200 sticky bottom-0 bg-white z-10 rounded-xl text-base">
                        <button onClick={handleBack} disabled={currentStep === 1} className={`px-10 py-2 md:px-18 md:py-3 rounded-md font-medium transition-colors ${currentStep === 1 ? 'border border-gray-400 text-gray-400 cursor-not-allowed' : 'border border-gray-400 text-gray-700 hover:bg-gray-100 cursor-pointer'}`}>
                            Back
                        </button>

                        {currentStep < 4 ? (
                            <button onClick={handleNext} className="px-10 py-2 md:px-18 md:py-3 bg-[#152A45] text-white rounded-md font-medium hover:bg-slate-900 transition-colors cursor-pointer">
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="px-10 py-2 md:px-18 md:py-3 bg-[#152A45] text-white rounded-md font-medium hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        {/* <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg> */}
                                        Posting...
                                    </>
                                ) : (
                                    "Post Job"
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelConfirm && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-[60] bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
                        {/* Header */}
                        <div className="flex items-start justify-between p-6 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Unsaved Changes</h3>
                            </div>
                            <button
                                onClick={cancelCancel}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer group"
                                aria-label="Close dialog"
                            >
                                <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 pb-6">
                            <p className="text-gray-600 leading-relaxed">
                                Are you sure you want to cancel? All your progress will be lost and cannot be recovered.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-2xl">
                            <button
                                onClick={cancelCancel}
                                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-white hover:border-gray-400 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-200"
                            >
                                Continue Editing
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 active:bg-red-800 transition-all cursor-pointer shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Discard Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}