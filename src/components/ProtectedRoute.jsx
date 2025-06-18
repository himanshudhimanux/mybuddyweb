import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { role, isAuthenticated } = useSelector((state) => state.auth);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
  }

  // If user role isn't allowed, redirect to unauthorized
  if (!allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
  }

  // Render the child component if authorized
  return children;
};


// Prop validation
ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;


