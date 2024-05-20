import React, { createContext, useState,useContext, useLayoutEffect } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading,setIsLoading] = useState(true);
  useLayoutEffect(()=>{
    let atoken = localStorage.getItem("accesstoken");
    let rtoken = localStorage.getItem("accesstoken");
    if(!(atoken===null || atoken === undefined))
      login(atoken,rtoken);
    setIsLoading(false);
  },[]);

  function login(accesstoken,refreshtoken){
    setToken(accesstoken);
    setIsAuthenticated(true);
    localStorage.setItem("accesstoken",accesstoken);
    localStorage.setItem("refreshtoken",refreshtoken);
  }

  function logout(){
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem("accesstoken");
    localStorage.removeItem("refreshtoken");
  }

  return (
    <AuthContext.Provider 
    value={{ 
        isAuthenticated, 
        token,
        isLoading,
        login,
        logout
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
export {AuthProvider, useAuth};