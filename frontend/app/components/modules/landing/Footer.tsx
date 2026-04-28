import React from 'react'

const Footer = () => {
  return (
    <footer className='max-w-300 mx-10 xl:mx-auto grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-4 gap-8 my-6'>
        <div className='flex flex-col gap-2'>
            <h2 className='font-bold text-3xl'>STORE</h2>
            <p className='text-sm text-gray-600'>Your first destination for quality products we create thee finest selection to meet your needs</p>
        </div>

        <div className='flex flex-col gap-4'>
            <h3 className='font-bold text-xl'>SHOP</h3>
            <p className='text-gray-400 hover:text-gray-800 cursor-pointer transition-all duration-300'>All products</p>
            <p className='text-gray-400 hover:text-gray-800 cursor-pointer transition-all duration-300'>Categories</p>
            <p className='text-gray-400 hover:text-gray-800 cursor-pointer transition-all duration-300'>New arrivals</p>
            <p className='text-gray-400 hover:text-gray-800 cursor-pointer transition-all duration-300'>Deals</p>
        </div>
        <div className='flex flex-col gap-4'>
            <h3 className='font-bold text-xl'>SUPPORT</h3>
            <p className='text-gray-400 hover:text-gray-800 cursor-pointer transition-all duration-300'>Help Center</p>
            <p className='text-gray-400 hover:text-gray-800 cursor-pointer transition-all duration-300'>Contact Us</p>
            <p className='text-gray-400 hover:text-gray-800 cursor-pointer transition-all duration-300'>Shipping Info</p>
            <p className='text-gray-400 hover:text-gray-800 cursor-pointer transition-all duration-300'>Returns & Exchanges</p>
        </div>
        <div className='flex flex-col gap-4'>
            <h3 className='font-bold text-xl'>COMPANY</h3>
            <p className='text-gray-400 hover:text-gray-800 cursor-pointer transition-all duration-300'>About Us</p>
            <p className='text-gray-400 hover:text-gray-800 cursor-pointer transition-all duration-300'>Careers</p>
            <p className='text-gray-400 hover:text-gray-800 cursor-pointer transition-all duration-300'>Privacy Policy</p>
            <p className='text-gray-400 hover:text-gray-800 cursor-pointer transition-all duration-300'>Terms of Service</p>
        </div>
    </footer>
  )
}

export default Footer
