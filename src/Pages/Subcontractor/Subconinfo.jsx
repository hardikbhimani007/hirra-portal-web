import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import onboardImage from "../../assets/images/Onboard.png";
import onboardbackground from "../../assets/images/Onboardbackground.png";
import logo from "../../assets/images/logo.png";
import profileicon from "../../assets/images/profileicon.png";

import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { HiOutlineMapPin } from "react-icons/hi2";

import { subcontracorcreate } from "../../services/userService";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Subconinfo = () => {
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    trades: [],
    location: "",
    email: "",
    position: null,
    radius: 0,
    radiusUnit: "km",
  });
  const [tradeInput, setTradeInput] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (formData.trades.length === 0) {
      newErrors.trades = "At least one trade is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    // if (!formData.position) {
    //   newErrors.location = "Please select a location on the map or use 'Set My Location'";
    // }

    if (!previewUrl) {
      newErrors.image = "Profile image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: "Please select a valid image file" });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size must be less than 5MB" });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setErrors({ ...errors, image: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setErrors({ ...errors, image: "Profile image is required" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const addTrade = (e) => {
    e.preventDefault();
    const trimmedInput = tradeInput.trim();

    if (trimmedInput !== "" && !formData.trades.includes(trimmedInput)) {
      setFormData({
        ...formData,
        trades: [...formData.trades, trimmedInput],
      });
      setTradeInput("");
      // Clear trades error when a trade is added
      if (errors.trades) {
        setErrors({ ...errors, trades: "" });
      }
    }
  };

  const removeTrade = (trade) => {
    setFormData({
      ...formData,
      trades: formData.trades.filter((t) => t !== trade),
    });
    // If no trades left, set error
    if (formData.trades.length === 1) {
      setErrors({ ...errors, trades: "At least one trade is required" });
    }
  };

  const handleMapClick = (latlng) => {
    setFormData({
      ...formData,
      position: [latlng.lat, latlng.lng],
      location: `Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)}`,
    });
    setErrors({ ...errors, location: "" });
    if (mapRef.current) {
      mapRef.current.setView([latlng.lat, latlng.lng], 13);
    }
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
          setErrors({ ...errors, location: "" });

          if (mapRef.current) {
            mapRef.current.setView(newPosition, 13);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setErrors({
            ...errors,
            location: "Unable to get your location. Please enter it manually.",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      setErrors({
        ...errors,
        location: "Geolocation is not supported by this browser.",
      });
    }
  };

  const handleFinish = async () => {
    if (isSubmitting) return;

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        profile_pictures: previewUrl || "",
        trade: formData.trades,
        location: formData.location,
        lat: formData.position ? formData.position[0] : null,
        long: formData.position ? formData.position[1] : null,
      };

      const response = await subcontracorcreate(payload);
      await localStorage.setItem("profilepictures", response.data?.profile_pictures);
      await localStorage.setItem("username", response.data?.name)
      toast.success("Subcontractor created successfully!");
      navigate("/subcontractor/jobs");
    } catch (error) {
      console.error("Error creating subcontractor:", error);
      toast.error("Failed to create subcontractor. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="absolute inset-0 bg-white/80 rounded-[20px] xl:rounded-[30px]" />

        <div className="w-full max-w-[95%] sm:max-w-[420px] md:max-w-[480px] lg:max-w-full xl:max-w-full relative z-10 flex flex-col h-full lg:p-4 p-0 rounded-xl">
          <div className="flex items-center justify-center pt-2 sm:pt-4 flex-shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="w-[120px] sm:w-[140px] md:w-[160px] lg:w-[140px] xl:w-[180px] 2xl:w-[220px] h-auto"
            />
          </div>

          <div className="pt-[40px] lg:pt-[60px] xl:pt-[40px] items-center justify-center flex-shrink-0">
            <h1 className="text-[#1A202C] font-semibold text-2xl 2xl:text-4xl text-center">
              Profile Setup
            </h1>
            <h1 className="text-[#718096] font-medium text-base leading-6 text-center">
              Let's get your account ready in a few quick steps.
            </h1>
          </div>

          <div className="py-4 lg:pt-[50px] items-center justify-center flex-1 overflow-hidden">
            <div className="bg-white border border-[#D8DDE6] w-full h-full rounded-[16px] p-4 flex flex-col max-h-full">
              <h3 className="font-bold text-lg text-[#1A202C] mb-5 flex-shrink-0">
                Name + Trade(s)
              </h3>

              <div className="flex-1 no-scrollbar overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="flex justify-center mb-0 flex-shrink-0 py-2">
                  <div
                    className={`relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full flex items-center justify-center transition-colors
                      ${previewUrl
                        ? "border-none bg-transparent"
                        : errors.image
                          ? "border-2 border-red-500 bg-red-50"
                          : "border-2 border-dashed border-[#D8DDE6] bg-[#F6F6F7]"
                      }`}
                  >
                    {previewUrl ? (
                      <>
                        <img
                          src={previewUrl}
                          alt="Profile Preview"
                          className="w-full h-full rounded-full object-cover cursor-pointer"
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-white border border-gray-300 shadow-md text-red-500 rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
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
                </div>

                {/* Show image error below the image container */}
                {errors.image && (
                  <p className="text-red-500 text-xs mt-1 text-center w-full">
                    {errors.image}
                  </p>
                )}

                <div className="flex flex-col gap-4 pr-2">
                  {/* Name Input */}
                  <div className="mb-[10px]">
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
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      maxLength={30}
                      className={`w-full h-[50px] px-3 py-2 text-sm border rounded-[10px] outline-none focus:ring-1 focus:ring-[#152A45] ${errors.name ? "border-red-500 focus:border-red-500" : "border-[#D8DDE6] focus:border-[#152A45]"
                        }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="mb-[10px]">
                    <label className="block font-medium text-[16px] text-[#1A202C] mb-2">
                      Trade (Typeahead) <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={`border rounded-lg p-2 flex flex-wrap items-center gap-2 min-h-[48px] ${errors.trades ? "border-red-500" : "border-gray-300"
                        }`}
                    >
                      {formData.trades.map((trade) => (
                        <span
                          key={trade}
                          className="bg-[#FF5800] text-white px-3 py-1 rounded-full flex items-center text-sm"
                        >
                          {trade}
                          <button
                            type="button"
                            onClick={() => removeTrade(trade)}
                            className="ml-2 text-xs hover:text-red-300 cursor-pointer"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                      {formData.trades.length < 5 && (
                        <form onSubmit={addTrade} className="flex-1 min-w-[150px] flex items-center">
                          <input
                            type="text"
                            placeholder="Type a trade & press Enter"
                            value={tradeInput}
                            onChange={(e) => {
                              if (e.target.value.length <= 30) setTradeInput(e.target.value);
                            }}
                            className="w-full border-none text-sm outline-none no-global-style"
                          />
                        </form>
                      )}
                    </div>
                    {errors.trades && (
                      <p className="text-red-500 text-xs mt-1">{errors.trades}</p>
                    )}
                    {formData.trades.length >= 5 && (
                      <p className="text-gray-500 text-xs mt-1">Maximum 5 trades allowed</p>
                    )}
                  </div>

                  <div className="mb-[10px]">
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full h-[50px] px-3 py-2 border rounded-md outline-none focus:ring-1 ${errors.location
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#152A45] focus:ring-[#152A45]"
                        }`}
                      placeholder="Enter your location"
                      maxLength={140}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  {/* Map */}
                  <div className="mb-[10px]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                        Map
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

                    <div className="h-48 sm:h-64 lg:h-48 xl:h-64">
                      <MapContainer
                        center={formData.position || [40.7128, -74.006]}
                        zoom={formData.position ? 13 : 12}
                        scrollWheelZoom={false}
                        className="w-full h-full rounded-lg"
                        ref={mapRef}
                        whenCreated={(mapInstance) => {
                          mapRef.current = mapInstance;
                          mapInstance.on("click", (e) =>
                            handleMapClick(e.latlng)
                          );
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
                              shadowSize: [41, 41],
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
                            radius={
                              formData.radius *
                              (formData.radiusUnit === "km" ? 1000 : 1609)
                            }
                            pathOptions={{
                              color: "#FF5800",
                              fillColor: "#FF5800",
                              fillOpacity: 0.2,
                              weight: 2,
                            }}
                          />
                        )}
                      </MapContainer>
                    </div>
                  </div>

                  <div className="flex justify-center pt-4 pb-2 shadow-[0px_-2px_8px_0px_#0000000F]">
                    <button
                      onClick={handleFinish}
                      type="button"
                      disabled={isSubmitting}
                      className={`w-[242px] h-[50px] bg-[#152A45] text-white p-2 rounded-[8px] transition-colors duration-200 ${isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#1a3a5f] cursor-pointer"
                        }`}
                    >
                      {isSubmitting ? "Processing..." : "Finish"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subconinfo;