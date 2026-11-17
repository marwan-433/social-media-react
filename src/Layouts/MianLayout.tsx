import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../Components/Navbar/Navbar'

function MianLayout() {
  return (
    <>
      <Navbar/>
      <Outlet/>
    </>
  )
}

export default MianLayout
