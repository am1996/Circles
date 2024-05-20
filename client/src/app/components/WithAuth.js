import { useLayoutEffect } from 'react';
import { redirect } from 'next/navigation';
import { useAuth } from '@/app/context/GlobalContext';
import Preloader from './Preloader';

function WithAuth(ProtectedComponent) {
  return function AuthHOC(props) {
    const { isAuthenticated,isLoading } = useAuth();
    // Redirect to login if not authenticated
    useLayoutEffect(() => {
      if (!isAuthenticated) {
        redirect("/user/login")
      }
    }, [isAuthenticated,isLoading]); // Only run when isAuthenticated changes
    if(isLoading){
      return (<Preloader />);
    }
    return <ProtectedComponent {...props} />;
  };
}

export default WithAuth;