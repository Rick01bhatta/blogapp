import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const user = useSelector((state) => state.auth.userData);

  if (!user) {
    // redirect to login if not logged in
    return <Navigate to="/login" replace />;
  }

  return children;
}
