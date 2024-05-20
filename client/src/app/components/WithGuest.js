import React, { useContext,useLayoutEffect } from 'react';
import { redirect } from 'next/navigation';
import { useAuth } from '@/app/context/GlobalContext';
import Preloader from './Preloader';

function WithGuest(ProtectedComponent) {
  return function GuestHOC(props) {
    const { isAuthenticated,isLoading } = useAuth();
    // Redirect to login if not authenticated
    useLayoutEffect(() => {
      if (isAuthenticated) {
        redirect("/");
      }
    }, [isAuthenticated,isLoading]); // Only run when isAuthenticated changes
    if(isLoading){
      return (<Preloader />);
    }
    return <ProtectedComponent {...props} />;
  };
}

export default WithGuest;