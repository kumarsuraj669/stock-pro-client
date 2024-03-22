import { createContext, useContext, useEffect, useState } from 'react';
const host = process.env.REACT_APP_HOST;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  const createUser = async (businessName, email, address, password)=>{
    const url = `${host}/api/auth/signup`
    
    const userData = {}
    if(businessName){userData.business_name = businessName}
    if(email){userData.email = email}
    if(address){userData.address = address}
    if(password){userData.password = password}

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      
      const resData = await response.json()

      if (resData.success){
        return ({success:true})
      } else if(resData.exists){
        return ({success: false, exists: true})
      } else {
          return ({'success': false})
      }
    } catch(e){
      return ({success:false, 'error':e});
    }
  }

  return (
    <AuthContext.Provider value={{ token, setToken, createUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
