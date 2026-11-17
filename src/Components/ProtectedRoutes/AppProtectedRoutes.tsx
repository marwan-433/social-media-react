import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { TokenContext } from '../Context/tokenContext';


export default function AppProtectedRoutes({children}: {children: React.ReactNode}) {

   const {token} = useContext(TokenContext)

    const navigate = useNavigate();

    useEffect(()=>{
        if(!token){
            navigate("/auth/login");
        }
    }, [token])
  return (
    <>
      {children}
    </>
  )
}
