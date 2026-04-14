import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PaymentRoute = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    // If employer and unpaid, redirect to payment page unless already there
    if (
        user?.role === "employer" &&
        user?.paymentStatus === "unpaid" &&
        location.pathname !== "/employer/payment"
    ) {
        return <Navigate to="/employer/payment" replace />;
    }

    return children;
};

export default PaymentRoute;
