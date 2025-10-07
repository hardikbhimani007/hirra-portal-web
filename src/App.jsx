import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
// routes
import Landing from "./Pages/Landing";
import HowItWorks from "./Pages/HowItWorks";
import TrustCompliance from "./Pages/TrustCompliance";
import Benefits from "./Pages/Benefits";
import ContactUs from "./Pages/ContactUs";
import CookiePolicy from "./Pages/Legal/CookiePolicy";
import PrivacyPolicy from "./Pages/Legal/PrivacyPolicy";
import TermsOfService from "./Pages/Legal/TermsOfService";
import TradespersonJobs from "./Pages/TradespersonJobs";
import SubcontractorJobs from "./Pages/SubcontractorJobs";
import Applications from "./Pages/Applications";
import Profile from "./Pages/Profile";
import SignIn from "./Pages/SignIn";
import Otp from "./Pages/Otp";
import Signup from "./pages/Signup";
import TradeInfo from "./Pages/Tradeperson/TradeInfo";
import Subconinfo from "./Pages/Subcontractor/Subconinfo";
import TradespersonMessages from "./Pages/TradespersonMessages";
import SubcontractorMessages from "./pages/SubcontractorMessages";
import SubcontractorProfile from "./pages/SubcontractorProfile";
import AdminSignIn from "./pages/Admin/SignIn";
import JobManagement from "./pages/Admin/JobManagement";
import Categories from "./pages/Admin/Categories";
import UserManagement from "./pages/Admin/UserManagement";
import CSCSverification from "./pages/Admin/CSCSverification";
import AdminMessages from "./pages/Admin/AdminMessages";
import Login from "./Pages/login";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";
import ManageSubcontractor from "./Pages/Admin/ManageSubcontractor";
import ManageTradeperson from "./Pages/Admin/ManageTradeperson";
import { register } from "./serviceWorkerRegistration";
import { smartroute } from "./services/userService";

function App() {

  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const userId = localStorage.getItem("userId");
  //     if (userId) {
  //       try {
  //         const response = await fetchUserById(userId);
  //         console.log(response, "response");
  //         if (response && response.data) {
  //           setUser(response.data);
  //           console.log(response.data, "user");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching user data:", error);
  //       }
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  function SmartRedirect({ children }) {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await smartroute();
          if (response && response.data) {
            setUserData(response.data);
          }
        } catch (error) {
          console.warn("User not logged in or API failed:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, []);

    if (loading) {
      return null;
    }

    if (userData) {
      const userType = userData.user_type;
      const username = userData.name;
      const profileStatus = userData.profile_status;

      if (profileStatus === "pending") {
        if (userType === "tradesperson" && location.pathname !== "/tradeInfo") {
          return <Navigate to="/tradeInfo" replace />;
        }
        if (userType === "subcontractor" && location.pathname !== "/subcontractorInfo") {
          return <Navigate to="/subcontractorInfo" replace />;
        }
      }

      if (profileStatus === "completed") {
        if (location.pathname === "/tradeInfo" && userType === "tradesperson") {
          return <Navigate to="/tradesperson/jobs" replace />;
        }
        if (location.pathname === "/subcontractorInfo" && userType === "subcontractor") {
          return <Navigate to="/subcontractor/jobs" replace />;
        }
      }

      if (location.pathname === "/") {
        if (userType === "tradesperson") {
          return (
            <Navigate
              to={profileStatus === "pending" ? "/tradeInfo" : "/tradesperson/jobs"}
              replace
            />
          );
        }
        if (userType === "subcontractor") {
          return (
            <Navigate
              to={profileStatus === "pending" ? "/subcontractorInfo" : "/subcontractor/jobs"}
              replace
            />
          );
        }
        if (userType === "admin") {
          return <Navigate to="/admin/jobs" replace />;
        }
      }
    }

    return children;
  }

  // function SmartRedirect({ children }) {
  //   const location = useLocation();
  //   const [loading, setLoading] = useState(true);
  //   const [userData, setUserData] = useState(null);

  //   useEffect(() => {
  //     const fetchUser = async () => {
  //       const userId = localStorage.getItem("userId");
  //       if (userId) {
  //         try {
  //           const response = await fetchUserById(userId);
  //           console.log(response, "response from SmartRedirect");
  //           if (response && response.data) {
  //             setUserData(response.data);
  //             console.log(response.data, "user data in SmartRedirect");
  //           }
  //         } catch (error) {
  //           console.error("Error fetching user data in SmartRedirect:", error);
  //         }
  //       }
  //       setLoading(false);
  //     };

  //     fetchUser();
  //   }, []);

  //   if (loading) {
  //     return null; // or a spinner/loading UI
  //   }

  //   const userType = localStorage.getItem("usertype");
  //   const username = localStorage.getItem("username");
  //   const firstVisit = !sessionStorage.getItem("firstVisitDone");

  //   if (userType && location.pathname === "/" && firstVisit) {
  //     sessionStorage.setItem("firstVisitDone", "true");

  //     if (userType === "tradesperson") {
  //       if (!username || username === "null") {
  //         return <Navigate to="/tradeInfo" replace />;
  //       }
  //       return <Navigate to="/tradesperson/jobs" replace />;
  //     }

  //     if (userType === "subcontractor") {
  //       if (!username || username === "null") {
  //         return <Navigate to="/subcontractorInfo" replace />;
  //       }
  //       return <Navigate to="/subcontractor/jobs" replace />;
  //     }

  //     if (userType === "admin") {
  //       return <Navigate to="/admin/jobs" replace />;
  //     }
  //   }

  //   return children;
  // }

  return (
    <BrowserRouter>
      <SmartRedirect>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignIn />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/registerchoice" element={<Signup />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/howitworks" element={<HowItWorks />} />
          <Route path="/trustcompliance" element={<TrustCompliance />} />
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/contactus" element={<ContactUs />} />

          <Route path="/legal/cookiepolicy" element={<CookiePolicy />} />
          <Route path="/legal/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/legal/termsofservice" element={<TermsOfService />} />

          <Route path="/tradeInfo" element={<ProtectedRoute><TradeInfo /></ProtectedRoute>} />
          <Route path="/tradesperson/jobs" element={<ProtectedRoute><TradespersonJobs /></ProtectedRoute>} />
          <Route path="/tradesperson/messages" element={<ProtectedRoute><TradespersonMessages /></ProtectedRoute>} />
          <Route path="/tradesperson/myapplications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />

          <Route path="/subcontractorInfo" element={<ProtectedRoute><Subconinfo /></ProtectedRoute>} />
          <Route path="/subcontractor/jobs" element={<ProtectedRoute><SubcontractorJobs /></ProtectedRoute>} />
          <Route path="/subcontractor/messages" element={<ProtectedRoute><SubcontractorMessages /></ProtectedRoute>} />
          <Route path="/subcontractor/profile" element={<ProtectedRoute><SubcontractorProfile /></ProtectedRoute>} />


          <Route path="/admin/signin" element={<AdminSignIn />} />
          <Route path="/admin/jobs" element={<AdminProtectedRoute><JobManagement /></AdminProtectedRoute>} />
          <Route path="/admin/categories" element={<AdminProtectedRoute><Categories /></AdminProtectedRoute>} />
          <Route path="/admin/user" element={<AdminProtectedRoute><UserManagement /></AdminProtectedRoute>} />
          <Route path="/admin/cscs/verification" element={<AdminProtectedRoute><CSCSverification /></AdminProtectedRoute>} />
          <Route path="/admin/managesubcontractor" element={<AdminProtectedRoute><ManageSubcontractor /> </AdminProtectedRoute>} />
          <Route path="/admin/managetradeperson" element={<AdminProtectedRoute><ManageTradeperson /></AdminProtectedRoute>} />
          <Route path="/admin/messages" element={<AdminProtectedRoute><AdminMessages /></AdminProtectedRoute>} />
        </Routes>
      </SmartRedirect>

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;

register();