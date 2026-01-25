import React from 'react'
import { Outlet } from 'react-router'
import Footer from '../pages/Shared/Footer/Footer'
import Navbar from '../pages/Shared/Navbar/Navbar'
import Banner from '../pages/Home/Banner/Banner'

const RootLayout = () => {
  return (
    <div className='max-w-7xl mx-auto'>
      <Navbar></Navbar>
      <Banner></Banner>
      <Outlet>
        
      </Outlet>
      <Footer></Footer>
    </div>
  )
}

export default RootLayout
