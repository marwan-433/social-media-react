import React, { createContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import type { userProfileType } from '../../types/user.types'
import { getMyProfile } from '../../services/profile.service'
import { useAuth } from './tokenContext'

export type UserContextType = {
    userDetails : userProfileType | null  ,
    setuserDetails:Dispatch<SetStateAction<userProfileType | null>>
}

export const UserContext=createContext<UserContextType | null>(null)

export default function UserContextProvider({children}: {children: React.ReactNode}) {
   const {token} =  useAuth()
    const [userDetails, setuserDetails] = useState<userProfileType | null>(null)

async function getUserProfile() {
    try {
        const {data} = await getMyProfile(); 
        console.log(data.data.user);
        setuserDetails(data.data.user)
    } catch (error) {
        console.log(error);
        
    }
}

useEffect(()=>{
 if (token) {
    getUserProfile()
 }

},[token])

  return (
    <>
    <UserContext.Provider value={{userDetails , setuserDetails}}>

    {children}

    </UserContext.Provider>
    </>
  )
}
