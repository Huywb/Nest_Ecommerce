'use client'
import { Product } from '@/app/types/product.type'
import Link from 'next/link'
import React from 'react'

const Breadcrumbs = ({ProductName = 'Product Name'}: {ProductName: string}) => {
  return (
    <div className='p-2 border-b border-gray-300'>
        <div className='py-4 max-w-300 mx-auto px-2'>
            <nav aria-label='Breadcrumbs' className='flex gap-3 text-sm'>
                <Link href={'/'} className='text-gray-500 hover:text-gray-900 transition-all duration-300'>Store</Link>
                <span className='text-gray-500'>/</span>
                <span>{ProductName}</span>
            </nav>
        </div>
    </div>
  )
}

export default Breadcrumbs
