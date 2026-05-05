import React from 'react'
import Header from '../components/modules/landing/Header'
import Footer from '../components/modules/landing/Footer'
import CartClient from '../components/modules/cart/CartClient'


export const revalidate = false
const page = () => {
  return (
    <div className='bg-gray-100'>
      <Header />
      <CartClient />
      <Footer/>
    </div>
  )
}

export default page

export function generateMetadata() {
  return {
    title: `Page - Title here`,
    description: "Page - Description here",
    icons: {
      icon: 'path to asset file'
    }
  }
}
