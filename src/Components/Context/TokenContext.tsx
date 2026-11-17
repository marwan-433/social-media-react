import React, {  useState } from 'react'
import { TokenContext } from './tokenContext';

export default function TokenContextProvider({children}: {children: React.ReactNode}) {

   const [token, settoken] = useState<string | null>(localStorage.getItem("userToken"));

  return (
   <TokenContext.Provider value={{token , settoken}}>
    {children}
   </TokenContext.Provider>
  )
}
