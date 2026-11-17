import React from 'react'
import { Outlet } from 'react-router'
import AuthIntro from '../Components/AuthIntro/AuthIntro'

function AuthLayout() {
  return (
    <>
      <main className='bg-sec h-full flex flex-col lg:flex-row justify-center items-center'>
        <div className='mx-10 my-10'>
        <div className="grid lg:grid-cols-2 gap-4">
            <div className='order-2 lg:order-0'>
              <AuthIntro/>
            </div>
            <div className='order-0 w-md mx-auto my-auto'><Outlet/></div>
        </div>
      </div>
      </main>
    </>
  )
}

export default AuthLayout
