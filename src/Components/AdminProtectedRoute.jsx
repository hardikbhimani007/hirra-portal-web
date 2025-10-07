import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
    const admin = localStorage.getItem("token");
    if (admin) {
        return children;
    } else {
        return <Navigate to="/admin/signin" />;
    }
}

export default AdminProtectedRoute;