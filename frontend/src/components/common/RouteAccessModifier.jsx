import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * This component can be placed in routes to automatically redirect users
 * to student features regardless of their account type, but we've disabled redirects
 * to allow the selected account type to determine which dashboard the user sees.
 */
const RouteAccessModifier = () => {
  const { user } = useSelector((state) => state.profile);
  const location = useLocation();

  useEffect(() => {
    // Only log access without performing any redirects
    if (user && location.pathname.includes('/dashboard')) {
      console.log('Dashboard access for path:', location.pathname);
      console.log('Current user account type:', user.accountType);
    }
  }, [location.pathname, user]);

  // This is a null component that doesn't render anything
  return null;
};

export default RouteAccessModifier;